import express from 'express';
import * as foodcontroller from './food.controller.js';

const foodRouter = express.Router({mergeParams : true});


foodRouter.route('/')
    .post(foodcontroller.addFood)
    .get(foodcontroller.getAllFoods);   


foodRouter.route('/:id')
    .get(foodcontroller.getOneFood)
    .delete(foodcontroller.deleteOneFood)
    .patch(foodcontroller.updateOneFood);

export default foodRouter;
