
import catchAsyncError from '../utils/catchAsyncError.js';
import userModel from '../../database/models/userModel.js';
import AppError from '../utils/AppError.js';
import * as factorHandler from '../Handler/factorHandler.js';


const addUser = catchAsyncError(async (req, res, next) => {
    let isFound = await userModel.findOne({email: req.body.email});
    if (isFound) return next(new AppError('this User is already entered before!!', 409));

    
    const result = new userModel(req.body);
    await result.save();

    res.json({
        status: 'success',
        message: 'User added successfully',
        data: result
    });
})

const getAllUsers = factorHandler.getAllDocuments(userModel , 'Users');

const getOneUser = factorHandler.getOne(userModel , 'User');

const deleteOneUser = factorHandler.deleteOne(userModel , 'User');

const updateOneUser = factorHandler.updateOne(userModel , 'User');



export { addUser, getAllUsers, deleteOneUser, updateOneUser, getOneUser }
