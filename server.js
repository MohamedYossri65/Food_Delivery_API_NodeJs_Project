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
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import init from './src/server.routes.js';

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

init(app);
// app.set('trust proxy', true);
/*connect to dataBase */
connectMongoDB();





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
