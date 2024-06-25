import express from 'express';
import * as foodcontroller from './food.controller.js';

const foodRouter = express.Router();


foodRouter.route('/')
    .post(foodcontroller.addFood)
    .get(foodcontroller.getAllFoods);


foodRouter.route('/:id').get(foodcontroller.getOneFood);

export default foodRouter;
