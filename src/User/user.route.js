import express from 'express';
import * as usercontroller from './user.controller.js';
import foodRouter from '../food/food.router.js';
import { allowedTo, protectedRouts } from '../auth/auth.controller.js';
import { uploadSingleFile } from '../middleware/fileUpload.js';

const userRouter = express.Router();

const restaurantRouter = express.Router();


userRouter.use('/:userId/foods', foodRouter);

userRouter.route('/')
    .post(protectedRouts, allowedTo('admin'),
        uploadSingleFile('users' ,'image'), usercontroller.addUser)
    .get(protectedRouts, allowedTo('admin'), usercontroller.getAllUsers);


userRouter.route('/:id')
    .get(protectedRouts, allowedTo('admin'), usercontroller.getOneUser)
    .delete(protectedRouts, allowedTo('admin'), usercontroller.deleteOneUser)
    .patch(protectedRouts, allowedTo('admin'),uploadSingleFile('users' ,'image'), usercontroller.updateOneUser);

restaurantRouter.route('/updateStatus')
    .patch(protectedRouts, allowedTo('resturant'), usercontroller.updateOneUser);


userRouter.get('/get-restaurant-within/distance/:distance/lnglat/:lnglat', usercontroller.getRestaurantWithin)

export { userRouter, restaurantRouter };
