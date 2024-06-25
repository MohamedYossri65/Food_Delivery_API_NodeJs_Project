export default class AppError extends Error {
    constructor(message ,statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Determine the error status based on the statusCode
        // If the statusCode starts with '4', set status to 'fail' (client-side error)
        // Otherwise, set status to 'error' (server-side error)
        this.status = `${statusCode}`.startsWith("4") ? 'fail' : 'error';

        // Mark the error as operational, distinguishing it from programming errors
        this.isOperationlError = true;
    }
}