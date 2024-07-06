
import cartModel from './../../database/models/cartModel.js';
import catchAsyncError from './../utils/catchAsyncError.js';
import AppError from './../utils/AppError.js';
import foodModel from './../../database/models/foodModel.js';

function calcTotalPrice(cart) {
    let totalPrice = 0;
    totalPrice = cart.item.reduce((acc, prod) => {
        return acc + (prod.price * prod.quantity);
    }, 0);
    cart.totalPrice = totalPrice;
}

const findFood = async (req, next) => {
    let food = await foodModel.findById(req.body.food);
    if (!food) return next(new AppError('Food not found', 404));
    req.body.price = food.price;
    return food;
}
const findCart = async (req, next) => {
    let userCart = await cartModel.findOne({ user: req.user._id });
    if (!userCart) {
        userCart = new cartModel({ user: req.user._id });
        await userCart.save();
    }
    return userCart;
}

const checkFoodQuantity = (req, next, userCart, food) => {
    let itemFound = userCart.item.find((elem) => elem.food._id.toString() == req.body.food);
    // 4. Check if the food quantity is available
    const totalRequestedQuantity = req.body.quantity + (itemFound ? itemFound.quantity : 0);
    if (food.quantity < totalRequestedQuantity) {
        return next(new AppError('Not enough quantity available!!', 404));
    }
    return itemFound;
}

const UpdateFoodQuantity = async (req, userCart, food ,itemFound) => {
    
    if (itemFound) {
        itemFound.quantity += req.body.quantity || 1;
    } else {
        req.body.quantity = req.body.quantity || 1;
        req.body.restaurant = food.resturant;
        await userCart.item.push(req.body);
    }
    // 5. Calculate the total price of the cart
    calcTotalPrice(userCart);
    // 6. Save the updated cart to the database
    await userCart.save();
}


const addToCart = catchAsyncError(async (req, res, next) => {
    // 1. Get the food item by ID
    let food = await findFood(req, next);

    // 2. Check if the user has a cart, if not, create a new cart
    let userCart = await findCart(req, next);

    // 3. Check if the food item is already in the cart and food quantity in db
    let itemFound =await  checkFoodQuantity(req, next, userCart, food);

    // 4. Update the quantity if the item is already in the cart, otherwise add it as a new item
    await  UpdateFoodQuantity(req, userCart, food ,itemFound);


    // 8. Send the response with the updated cart
    res.status(200).json({
        status: 'success',
        message: 'Food added to cart successfully',
        data: userCart
    });
});



const deleteProductFromCart = catchAsyncError(async (req, res, next) => {
    // 1. Check if the id is a food id
    const food = await foodModel.findById(req.params.id);
    if (!food) return next(new AppError('food not found', 404));

    // 1. Check if the user has a cart, if not, return an error
    const updatedCart = await cartModel.findOneAndUpdate({
        user: req.user._id
    }, { $pull: { item: { food: req.params.id } } },
        { new: true });

    if (!updatedCart) return next(new AppError('Cart not found', 404));
    // 5- calculate the total price of the food
    calcTotalPrice(updatedCart);
    // 6- save the cart to db
    await updatedCart.save();
    // 7- send the response with the updated cart
    res.status(200).json({
        status: 'success',
        message: 'food removed from cart successfully',
        data: updatedCart
    });

});


const updateQuantity = catchAsyncError(async (req, res, next) => {
    // 1- get the food id
    const food = await foodModel.findById(req.body.food);
    if (!food) return next(new AppError('food not found', 404));

    req.body.price = food.price;

    let userCart = await cartModel.findOne({ user: req.user._id });

    let itemFound = checkFoodQuantity (req, next, userCart, food)

    if (!itemFound) {
        return next(new AppError('item not in the cart!!', 404));
    }
    itemFound.quantity = req.body.quantity || 1;
    
    // 5- calculate the total price of the food
    calcTotalPrice(userCart);
    // 6- save the cart to db
    await userCart.save();
    // 7- send the response with the updated cart
    res.status(200).json({
        status: 'success',
        message: 'Quantity updated successfully',
        data: userCart
    });

});

const getLoggedUserCart = catchAsyncError(async (req, res, next) => {
    let cartItems = await cartModel.findOne({ user: req.user._id }).populate({ path: 'item.food', select: 'name price' });

    res.status(200).json({
        status: 'success',
        message: 'cart found successfully',
        data: cartItems
    });
});




export { addToCart, updateQuantity, deleteProductFromCart, getLoggedUserCart }
