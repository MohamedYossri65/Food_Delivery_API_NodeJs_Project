// Event listener for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('closing the server due to uncaughtException💥!!');
    console.log('uncaughtException', err.name, err.message);
    process.exit(1);
});



import express from 'express';
import connectMongoDB from './database/dbConnections.js';
import 'dotenv/config'
import morgan from 'morgan';
import foodRouter from './src/food/food.router.js';
import globalErrorHandling from './src/middleware/globalErrorHandling.js';
import AppError from './src/utils/AppError.js';
import categoryRouter from './src/category/category.route.js';
import authRouter from './src/auth/auth.router.js';
import userRouter from './src/User/user.route.js';

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import reviewRouter from './src/review/review.route.js';

const app = express();
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour.'
})
app.use('/api', limiter);


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

// Data sanitization against XSS
app.use(xss());

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

// app.set('trust proxy', true);
/*connect to dataBase */
connectMongoDB();

/*routs*/
app.use('/api/v1/food', foodRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/review', reviewRouter);

/*handel unknon routs */
app.all('/*', (req, res, next) => {
    next(new AppError(`this route ${req.originalUrl} is not found `, 404));
})

/*globel error handel */
app.use(globalErrorHandling);

/*listen to req and res */
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`server is running on port ${port}...💯`);
});

// Event listener for unhandled promise rejections like error in database connection
process.on('unhandledRejection', (err) => {
    console.log('closing the server due to unhandledRejection💥!!');
    console.log('unhandledRejection', err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
});
