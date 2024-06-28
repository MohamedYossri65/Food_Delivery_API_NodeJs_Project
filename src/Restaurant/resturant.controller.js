
import catchAsyncError from '../utils/catchAsyncError.js';
import resturantModel from '../../database/models/resturantModel.js';
import AppError from '../utils/AppError.js';


import * as factorHandler from '../Handler/factorHandler.js'

const addResturant = catchAsyncError(async (req, res, next) => {
    let isFound = await resturantModel.findOne({email: req.body.email});
    if (isFound) return next(new AppError('this Resturant is already entered before!!', 409));

    
    const result = new resturantModel(req.body);
    await result.save();

    res.json({
        status: 'success',
        message: 'Resturant added successfully',
        data: result
    });
})

const getAllResturants = factorHandler.getAllDocuments(resturantModel , 'resturants');

const getOneResturant = factorHandler.getOne(resturantModel , 'resturant');

const deleteOneResturant = factorHandler.deleteOne(resturantModel , 'resturant');

const updateOneResturant = factorHandler.updateOne(resturantModel , 'resturant');



export { addResturant, getAllResturants, deleteOneResturant, updateOneResturant, getOneResturant }
