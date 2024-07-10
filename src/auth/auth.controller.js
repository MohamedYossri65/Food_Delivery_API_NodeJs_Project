import cryptography from "cryptography";
import AppError from "../utils/AppError.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import sendEmail from "../utils/sendEmail.js";
import userModel from './../../database/models/userModel.js';
import jwt from 'jsonwebtoken';



const createSendToken = (user, statusCode, response, message) => {
    const token = jwt.sign({
        id: user._id,
        email: user.email,
        name: user.name
    }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });;

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    response.cookie('jwt', token, cookieOptions);
    response.status(statusCode).json({
        status: 'success',
        message: message,
        token
    });
}

const checkConfirmPassword = (req) => {
    if (req.body.password != req.body.confirmPassword)
        return next(new AppError('password confirm not match!!', 406));
}

const signUp = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) return next(new AppError(`this user is already signed Up before!!`, 409));
    checkConfirmPassword(req);
    
    if(req.file) req.body.image = req.file.filename;
    const result = new userModel(req.body);
    result.userLocation = req.body.userLocation ? {
        type: 'Point',
        coordinates: req.body.userLocation.coordinates
    } : undefined

    await result.save();

    res.json({
        status: 'success',
        message: 'signed up successfully',
        data: result
    });
});

const signIn = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');
    if (!user || !(user.correctPassword(password, user.password))) {
        return next(new AppError('invalid email or password', 401));
    }
    createSendToken(user, 200, res, 'logged in successfully');
})

const forgetPsssword = catchAsyncError(async (req, res, next) => {
    //1- get user 
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('User with this email is not found!!', 404));
    }
    //2- Generate the random reset token
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit  click to this link: ${resetURL} \n If you didn't forget your password, please ignore this email!`
    const result = await sendEmail(user.email, message);

    if (!result) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiersAt = undefined;
        return next(new AppError('There was an error sending email. Please try again later!', 500));
    }

    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
    });

})

const resetPsssword = catchAsyncError(async (req, res, next) => {
    const hashedToken = cryptography.encryptSync(req.params.token);
    const user = await userModel.findOne({
        passwordResetToken: hashedToken
        , passwordResetTokenExpiersAt: {
            $gt: Date.now()
        }
    });
    if (!user) {
        return next(new AppError('Invalid ResetToken or ResetToken expired!!', 400));
    }
    checkConfirmPassword(req);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiersAt = undefined;

    user.password = req.body.password;
    user.passwordUpdatedAt = Date.now() - 1000;
    await user.save();

    createSendToken(user, 200, res, 'password updated successfully');
})

const updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.user.email })
    if (!user) {
        return next(new AppError('User with this email is not found!!', 404));
    }
    if (!(user.correctPassword(req.body.oldPassword, req.user.password))) {
        return next(new AppError('Invalid old password!!', 401));
    }
    if (req.body.newPassword == req.body.oldPassword) {
        return next(new AppError('new password must be different from the old password!!', 406));
    }
    checkConfirmPassword(req);
    user.password = req.body.newPassword;
    user.passwordUpdatedAt = Date.now() - 1000;
    await user.save();

    createSendToken(user, 200, res, 'password updated successfully');

})

const updateMe = catchAsyncError(async (req, res, next) => {
    if(req.file) req.body.image = req.file.filename;
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.status(200).json({
        status: 'success',
        message: 'user updated successfully',
        data: updatedUser
    });

})

const deleteMe = catchAsyncError(async (req, res, next) => {
    if (Object.keys(req.body).length) {
        return next(new AppError('Request body must be empty', 400));
    }
    await userModel.findByIdAndUpdate(req.user._id, { isActive: false });
    res.status(200).json({
        status: 'success',
        message: 'user deleted successfully',
        data: null
    });

})


/******************************************************* */
const protectedRouts = catchAsyncError(async (req, res, next) => {
    // 1- check if token found in header or not 
    let token = undefined;
    if (!req.headers.authorization && !req.headers.authorization?.startsWith('Bearer ')) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    token = req.headers.authorization.split(' ')[1];
    //3- decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //4- check if user exist or not
    const currentUser = await userModel.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    //5- check if token is valid token or expired

    if (currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }
    //6- grant access to protected route
    req.user = currentUser;
    next();
});

const allowedTo = (...roles) => {
    return catchAsyncError(async(req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('you are not allowed to access this route', 403));
        }
        next();
    })
}

export {
    signUp, signIn, protectedRouts, allowedTo,
    forgetPsssword, resetPsssword, updatePassword, updateMe,
    deleteMe
};