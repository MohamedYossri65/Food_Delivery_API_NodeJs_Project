
import catchAsyncError from '../utils/catchAsyncError.js';
import foodModel from './../../database/models/foodModel.js';





const addFood = catchAsyncError(async(req, res, next) => {
    res.json({
        message: "addFood"
    })
})

const getAllFoods = catchAsyncError(async (req, res, next) => {
    const foods = await foodModel.find();
    res.status(200).json({ status: "success", ressult: foods.length, message: "foods found", data: { foods } });

})

const getOneFood = catchAsyncError(async (req, res, next) => {
    const foods = await foodModel.findById(req.params.id);
    res.status(200).json({ status: "success", ressult: foods.length, message: "foods found", data: { foods } });

})
const deleteFood = catchAsyncError(async(req, res, next) => {
    res.json({
        message: "deleteFood"
    })
})
const updateFood = catchAsyncError(async(req, res, next) => {
    res.json({
        message: "updateFood"
    })
})



export { addFood, getAllFoods, deleteFood, updateFood ,getOneFood}