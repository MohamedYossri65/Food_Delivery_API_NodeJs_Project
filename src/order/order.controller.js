import orderModel from '../../database/models/orderModel.js';
import cartModel from './../../database/models/cartModel.js';
import catchAsyncError from './../utils/catchAsyncError.js';
import AppError from './../utils/AppError.js';
import foodModel from '../../database/models/foodModel.js';
import userModel from '../../database/models/userModel.js';
import moment from 'moment';


/*==========================================add order============================================== */

// Helper Functions

const getUserCart = async (userId, next) => {
    const userCart = await cartModel.findOne({ user: userId });
    if (!userCart || userCart.item.length === 0) {
        next(new AppError('No food in your cart', 400));
        return null;
    }
    return userCart;
};

const checkFoodAvailability = async (userCart) => {
    let foodAvailable = true;
    let foodNotAvailable = [];

    for (let item of userCart.item) {
        const food = await foodModel.findById(item.food);
        if (!food || food.quantity < item.quantity) {
            foodAvailable = false;
            foodNotAvailable.push(food ? food.name : 'unknown food item');
            break;
        }
    }

    return { foodAvailable, foodNotAvailable };
};

const createOrder = async (userId, userCart, req) => {

    const order = new orderModel({
        user: userId,
        item: userCart.item,
        totalPrice: userCart.totalPrice,
    });

    order.shippingAddress = req.body.shippingAddress ? {
        type: 'Point',
        coordinates: req.body.shippingAddress.coordinates
    } : undefined

    // 3. Create the order in the database
    await order.save();
    return order;
};

const updateFoodQuantity = async (order, next) => {
    // 4. Update the food quantities in the database
    let food = {};
    for (let item of order.item) {
        food = await foodModel.findById(item.food);
        if (!food) {
            return next(new AppError('Food not found', 404));
        }
        if (food.quantity < item.quantity) {
            return next(new AppError(`Not enough quantity in stock for ${food.name}`, 400));
        }
        food.quantity -= item.quantity;
        food.soldedQuantity = (food.soldedQuantity || 0) + item.quantity;
        await foodModel.findByIdAndUpdate(item.food, {
            quantity: food.quantity,
            soldedQuantity: food.soldedQuantity
        })
        // TODO:
        // Send notification to the food vendor about the order
        // await sendNotificationToVendor(food.vendor, order);

        // Send notification to the user about the order
        // await sendNotificationToUser(order.user, order);

        // Log the order
        // await logOrder(order);
    }
}

const updateUserCancellationInfo = async (userId) => {
    await userModel.findByIdAndUpdate(userId, {
        $inc: { canceledOrder: 1 },
        lastCancellationTime: Date.now()
    });
};
const updateUserOrderInfo = async (userId) => {
    await userModel.findByIdAndUpdate(userId, {
        $inc: { orderedFood: 1 }
    });
};

// Middleware to check if the user can cancel an order
const canCreateOrder = (req, next) => {
    const { canceledOrder, lastCancellationTime } = req.user;

    if (canceledOrder > 1) {
        const currentTime = Date.now();
        const twoHoursInMillis = 2 * 60 * 60 * 1000;
        const nextAllowedCancellationTime = new Date(lastCancellationTime).getTime() + twoHoursInMillis;

        if (currentTime < nextAllowedCancellationTime) {
            const waitTime = moment.duration(nextAllowedCancellationTime - currentTime).humanize();
            return next(new AppError(
                `You have reached the maximum number of canceled orders. Please wait ${waitTime} before attempting to cancel another order.`,
                403
            ));
        }
    }
    return true;
};

// Controller Functions to add order
const addOrder = catchAsyncError(async (req, res, next) => {
    // Check if the user can create an order
    if (!(canCreateOrder(req, next))) return;
    
    // 1. Get the user's cart
    const userCart = await getUserCart(req.user._id, next);
    if (!userCart) return; // If no cart or empty cart, getUserCart will handle the error response

    // 2. Check food availability in the cart
    const { foodAvailable, foodNotAvailable } = await checkFoodAvailability(userCart);
    if (!foodAvailable) {
        return next(new AppError(`Not enough quantity available for ${foodNotAvailable.join(', ')} in the cart`, 400));
    }

    // 3. Create the order
    const order = await createOrder(req.user._id, userCart, req);

    // 4. Update the food quantities in the database
    await updateFoodQuantity(order, next);


    // 4. Remove the cart
    // Clear the cart items
    await cartModel.findOneAndUpdate({ user: req.user._id }, { $set: { 'item': [] }, totalPrice: 0 }, { new: true });

    await updateUserOrderInfo(req.user._id);
    // 5. Send the response with the new order
    res.status(201).json({
        status: 'success',
        message: 'Order added successfully',
        data: order
    });
});

/*=========================================get orders=============================================== */
// Helper function to fetch orders
const fetchOrders = async (filter, next) => {
    const orders = await orderModel.find(filter);

    if (!orders || orders.length === 0) {
        next(new AppError('Orders not found!!', 404));
        return null;
    }

    return orders;
};

// Controller to get all orders for one restaurant
const getAllOrdersforOnerestaurant = catchAsyncError(async (req, res, next) => {
    const orders = await fetchOrders({
        item: {
            $elemMatch: { restaurant: req.user._id }
        }
    }, next);

    if (!orders) return;

    res.status(200).json({
        status: 'success',
        message: 'Orders found successfully',
        data: orders
    });
});

// Controller to get all orders for one user
const getAllOrdersforOneUser = catchAsyncError(async (req, res, next) => {
    const orders = await fetchOrders({ user: req.user._id }, next);

    if (!orders) return;

    res.status(200).json({
        status: 'success',
        result: orders.length,
        message: 'Orders found successfully',
        data: orders
    });
});



/*=============================================cancel order=========================================== */


// Helper Functions

const getOrderById = async (orderId, next) => {
    const order = await orderModel.findOne({ _id: orderId });
    if (!order) {
        next(new AppError('Order not found!!', 404));
        return null;
    }
    return order;
};

const isOrderOwner = (order, user) => {
    return order.user.email === user.email;
};

const canCancelOrder = (order) => {
    return order.statusOfOrder === 'pending';
};

const updateOrderStatus = async (orderId, status, next) => {
    try {
        const updatedOrder = await orderModel.findOneAndUpdate(
            { _id: orderId },
            { statusOfOrder: status },
            { new: true }
        );
        return updatedOrder;
    } catch (error) {
        next(new AppError('Failed to update order status', 500));
        return null;
    }
};

// Controller Function to cancel an order
const cancelOrder = catchAsyncError(async (req, res, next) => {
    // 1. Check if the order exists
    const order = await getOrderById(req.params.id, next);
    if (!order) return; // If order not found, getOrderById will handle the error response

    // 2. Check if the user making the request is the order's owner
    if (!isOrderOwner(order, req.user)) {
        return next(new AppError('You are not authorized to cancel this order!!', 401));
    }

    // 3. Check if the order is pending before cancelling it
    if (!canCancelOrder(order)) {
        return next(new AppError(`this order is already ${order.statusOfOrder}`, 400));
    }

    // 4. Update the order status to cancelled
    const updatedOrder = await updateOrderStatus(order._id, 'cancelled', next);
    if (!updatedOrder) return; // If update fails, updateOrderStatus will handle the error response

    // 5. Send a notification to the user about the cancellation
    // TODO: Implement sendNotificationToUser(req.user, 'Your order has been cancelled.');

    // 6. Log the cancellation
    // TODO: Implement logCancellation(order);


    await updateUserCancellationInfo(req.user._id)
    // 7. Respond with success message and the updated order
    res.status(200).json({
        status: 'success',
        message: 'Order cancelled successfully',
        data: updatedOrder
    });
});
/*======================================================================================== */


export { addOrder, getAllOrdersforOnerestaurant, getAllOrdersforOneUser, cancelOrder  ,canCreateOrder}
