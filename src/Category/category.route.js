import express from 'express';
import * as categorycontroller from './category.controller.js';
import foodRouter from '../Food/food.router.js';

const categoryRouter = express.Router();

//          /:categoryId/foods
categoryRouter.use('/:categoryId/foods' , foodRouter);

categoryRouter.route('/')
    .post(categorycontroller.addCategory)
    .get(categorycontroller.getAllCategories);   


categoryRouter.route('/:id')
    .get(categorycontroller.getOneCategory)
    .delete(categorycontroller.deleteOneCategory)
    .patch(categorycontroller.updateOneCategory);

export default categoryRouter;
