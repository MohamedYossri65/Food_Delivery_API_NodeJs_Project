import express from 'express';
import * as foodcontroller from './food.controller.js';
import { allowedTo, protectedRouts } from '../auth/auth.controller.js';
import { uploadMixOfFiles } from '../middleware/fileUpload.js';

const foodRouter = express.Router({ mergeParams: true });

let fieldArray = [{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 10 }]

foodRouter.route('/')
    .post(protectedRouts, allowedTo('resturant'),
        uploadMixOfFiles('food', fieldArray), foodcontroller.handelImages,
        foodcontroller.addFood)
    .get(foodcontroller.getAllFoods);


foodRouter.route('/:id')
    .get(foodcontroller.getOneFood)
    .delete(protectedRouts, allowedTo('resturant'), foodcontroller.deleteOneFood)
    .patch(protectedRouts, allowedTo('resturant'),
        uploadMixOfFiles('food', fieldArray), foodcontroller.handelImages,
        foodcontroller.updateOneFood);

export default foodRouter;
