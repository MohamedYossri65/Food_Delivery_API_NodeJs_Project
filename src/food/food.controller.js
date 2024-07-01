
import foodModel from '../../database/models/foodModel.js';
import * as factorHandler from '../Handler/factorHandler.js'


const addFood = factorHandler.addOne(foodModel, 'food');

const getAllFoods = factorHandler.getAllDocuments(foodModel, 'foods' ,'params');

const getOneFood = factorHandler.getOne(foodModel, 'food');

const deleteOneFood = factorHandler.deleteOne(foodModel, 'food');

const updateOneFood = factorHandler.updateOne(foodModel, 'food');



export { addFood, getAllFoods, deleteOneFood, updateOneFood, getOneFood }
