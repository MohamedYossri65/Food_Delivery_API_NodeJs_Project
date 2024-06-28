import categoryModel from '../../database/models/categoryModel.js';


import * as factorHandler from '../Handler/factorHandler.js'

const addCategory = factorHandler.addOne(categoryModel , 'category');

const getAllCategories = factorHandler.getAllDocuments(categoryModel , 'categories');

const getOneCategory = factorHandler.getOne(categoryModel , 'category');

const deleteOneCategory = factorHandler.deleteOne(categoryModel , 'category');

const updateOneCategory = factorHandler.updateOne(categoryModel , 'category');



export { addCategory, getAllCategories, deleteOneCategory, updateOneCategory, getOneCategory }
