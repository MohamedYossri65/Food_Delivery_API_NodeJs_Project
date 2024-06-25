// Event listener for uncaught exceptions
process.on('uncaughtException',(err)=>{
    console.log('closing the server due to uncaughtException💥!!');
    console.log('uncaughtException',err.name ,err.message);
    process.exit(1);
});



import express from 'express';
import connectMongoDB from './database/dbConnections.js';
import 'dotenv/config'
import morgan from 'morgan';
import foodRouter from './src/food/food.router.js';
import globalErrorHandling from './src/middleware/globalErrorHandling.js';
import AppError from './src/utils/AppError.js';


const app = express();
/* middelWares */
app.use(express.json());

if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
}


/*connect to dataBase */
connectMongoDB();

/*routs*/
app.use('/api/v1/food',foodRouter);

/*handel unknon routs */
app.all('*',(req,res,next) => {
    next(new AppError(`this route ${req.originalUrl} is not found `,404));
})

/*globel error handel */
app.use(globalErrorHandling);


/*listen to req and res */
const port = process.env.PORT||3000;
const server = app.listen(port ,()=>{
    console.log(`server is running on port ${port}...💯`);
});

// Event listener for unhandled promise rejections like error in database connection
process.on('unhandledRejection',(err)=>{
    console.log('closing the server due to unhandledRejection💥!!');
    console.log('unhandledRejection',err.name ,err.message);
    server.close(()=>{
        process.exit(1);
    })
});
