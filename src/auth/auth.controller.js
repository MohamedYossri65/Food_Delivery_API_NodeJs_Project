import AppError from "../utils/AppError.js";
import catchAsyncError from "../utils/catchAsyncError.js";
import userModel from './../../database/models/userModel.js';

import jwt from 'jsonwebtoken';


const signUp = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) return next(new AppError('this User is already signed Up before!!', 409));
    if (req.body.password != req.body.confirmPassword)
        return next(new AppError('password confirm not match!!', 406));

    const result = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
    });
    await result.save();

    res.json({
        status: 'success',
        message: 'signed up successfully',
        data: result
    });
})

const signIn = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('please enter email and password', 400));
    }
    const user = await userModel.findOne({ email });
    if (!user || !(user.correctPassword(password, user.password))) {
        return next(new AppError('invalid email or password', 401));
    }

    const token = jwt.sign({
        id: user._id,
        email: user.email,
        name: user.name
    }, process.env.JWT_SECRET_KEY, { expiresIn: '100d' });

    res.json({
        status: 'success',
        message: 'logged in successfully',
        token: token
    });
})

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

    if(currentUser.changePasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }
    //6- grant access to protected route
    req.user = currentUser;
    next();
});

const allowedTo = (...roles)=>{
    return catchAsyncError((req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('you are not allowed to access this route', 403));
        }
        next();
    })
}

export { signUp, signIn, protectedRouts ,allowedTo};