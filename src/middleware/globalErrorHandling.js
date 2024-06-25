
//send value that not id in params
const handelCastError =(err)=>{
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
}
//duPlicate key error
const handelDuPlicateError =(err)=>{
    const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    const message = `DuPlicate field value: ${value} please use another value!`;
    return new AppError(message, 400);
}
//error in validation like max value or number of characters
const handelValidationError =(err)=>{
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

// Function to handle errors in production environment
const sendErrProduction =(err, res)=> {
    // Check if the error is an operational error or a programming error

    //operational error
    if (err.isOperationlError) {
        // Set statusCode to the error's statusCode or default to 500 if not set
        let statusCode = err.statusCode || 500;
        // Send a JSON response with the error status and message
        res.status(statusCode).json({
            status: err.status,
            message: err.message
        });

    //programming error 
    } else {
        // Log the error to the console for debugging
        console.error('ERROR', err);
        // Send a generic error response
        res.status(500).json({
            status: "error",
            message: "Something went wrong"
        });
    }
}

// Function to handle errors in development environment
const sendErrDeveolpment =(err, res)=> {
    // Set statusCode to the error's statusCode or default to 500 if not set
    let statusCode = err.statusCode || 500;
    // Send a JSON response with detailed error information
    res.status(statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack 
    });
}

// Global error handling middleware
const globalErrorHandling = (err, req, res, next) => {
    // Check the environment and call the appropriate error handling function
    if (process.env.NODE_ENV == 'production') {
        sendErrProduction(err, res);
    } else if (process.env.NODE_ENV == 'development') {
        const error ={...err};
        //send value that not id in params
        if(error.name == 'castError') error = handelCastError(error);
        //duPlicate key error
        if(error.code == 11000) error = handelDuPlicateError(error);
        //error in validation like max value or number of characters
        if(error.name == 'validationError') error = handelValidationError(error);
        sendErrDeveolpment(error, res);
    }
};

export default globalErrorHandling;