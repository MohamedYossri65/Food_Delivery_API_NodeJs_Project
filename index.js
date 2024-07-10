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
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import init from './src/server.routes.js';
import { limiter } from './src/middleware/rateLimit.js';
import initSocket from './src/utils/socketIo.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';

const app = express();
const server = initSocket(app);


// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

app.use('/api', limiter);

// use it before all route definitions
app.use(cors());
// Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());
// Data sanitization against XSS
app.use(xss());


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '100kb' }));

app.use(express.static('uploads'));
app.use(express.urlencoded({extended: true}));

// Cookie parser, reading cookies into req.cookies
app.use(cookieParser());

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}
app.use(compression())

init(app);
// app.set('trust proxy', true);
/*connect to dataBase */
connectMongoDB();





/*listen to req and res */
const port = process.env.PORT || 3000;
server.listen(port, () => {
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
