import foodRouter from './food/food.router.js';
import globalErrorHandling from './middleware/globalErrorHandling.js';
import AppError from './utils/AppError.js';
import authRouter from './auth/auth.router.js';
import  { userRouter,restaurantRouter } from './User/user.route.js';
import reviewRouter from './review/review.route.js';
import cartRouter from './cart/cart.router.js';
import orderRouter from './order/order.router.js';
import notificationRouter from './notification/notification.router.js';
import categoryRouter from './Category/category.route.js';

const init = (app) => {
    /*----------------------------------- */
    /*routs*/
    app.use('/api/v1/food', foodRouter);
    app.use('/api/v1/category', categoryRouter);
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/review', reviewRouter);
    app.use('/api/v1/cart', cartRouter);
    app.use('/api/v1/orders', orderRouter);
    app.use('/api/v1/restaurant', restaurantRouter);
    app.use('/api/v1/notification', notificationRouter);
    /*----------------------------------- */
    /*handel unknon routs */
    app.all('/*', (req, res, next) => {
        next(new AppError(`this route ${req.originalUrl} is not found `, 404));
    })

    /*globel error handel */
    app.use(globalErrorHandling);

}

export default init;
