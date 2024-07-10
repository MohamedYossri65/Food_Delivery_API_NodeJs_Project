import express from 'express';
import * as categorycontroller from './category.controller.js';
import foodRouter from '../Food/food.router.js';
import { allowedTo, protectedRouts } from '../auth/auth.controller.js';
import { uploadSingleFile } from '../middleware/fileUpload.js';

const categoryRouter = express.Router();

//          /:categoryId/foods
categoryRouter.use('/:categoryId/foods', foodRouter);

categoryRouter.route('/')
    .post(protectedRouts, allowedTo('admin'),
        uploadSingleFile('category', 'image'), categorycontroller.handelImage,
        categorycontroller.addCategory)
        
    .get(categorycontroller.getAllCategories);


categoryRouter.route('/:id')
    .get(categorycontroller.getOneCategory)
    .delete(protectedRouts, allowedTo('admin'), categorycontroller.deleteOneCategory)
    .patch(protectedRouts, allowedTo('admin'),
        uploadSingleFile('category', 'image'), categorycontroller.handelImage,
        categorycontroller.updateOneCategory);

export default categoryRouter;
