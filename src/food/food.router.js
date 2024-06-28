import express from 'express';
import * as foodcontroller from './food.controller.js';
import { protectedRouts } from '../auth/auth.controller.js';

const foodRouter = express.Router();


foodRouter.route('/')
    .post(foodcontroller.addFood)
    .get(protectedRouts ,foodcontroller.getAllFoods);   


foodRouter.route('/:id')
    .get(foodcontroller.getOneFood)
    .delete(foodcontroller.deleteOneFood)
    .patch(foodcontroller.updateOneFood);

export default foodRouter;
