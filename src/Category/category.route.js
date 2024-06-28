import express from 'express';
import * as categorycontroller from './category.controller.js';

const categoryRouter = express.Router();


categoryRouter.route('/')
    .post(categorycontroller.addCategory)
    .get(categorycontroller.getAllCategories);   


categoryRouter.route('/:id')
    .get(categorycontroller.getOneCategory)
    .delete(categorycontroller.deleteOneCategory)
    .patch(categorycontroller.updateOneCategory);

export default categoryRouter;
