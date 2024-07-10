
import foodModel from '../../database/models/foodModel.js';
import * as factorHandler from '../Handler/factorHandler.js'


const handelImages = (req, res, next) => {
    // Extract and save image filenames from request files
    if (!req.files) return next();
    req.body.images=[];

    req.body.imageCover = req.files.imageCover[0].filename;
    req.files.images.map((obj) => {
        req.body.images.push(obj.filename)
    });
    next();
}

const addFood = factorHandler.addOne(foodModel, 'food');

const getAllFoods = factorHandler.getAllDocuments(foodModel, 'foods', 'params');

const getOneFood = factorHandler.getOne(foodModel, 'food');

const deleteOneFood = factorHandler.deleteOne(foodModel, 'food');

const updateOneFood = factorHandler.updateOne(foodModel, 'food');



export { addFood, getAllFoods, deleteOneFood, updateOneFood, getOneFood, handelImages }
