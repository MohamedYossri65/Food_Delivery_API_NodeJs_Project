import express from 'express';
import * as usercontroller from './user.controller.js';
import foodRouter from './../Food/food.router.js';

const userRouter = express.Router();

userRouter.use('/:userId/foods', foodRouter);

userRouter.route('/')
    .post(usercontroller.addUser)
    .get(usercontroller.getAllUsers);


userRouter.route('/:id')
    .get(usercontroller.getOneUser)
    .delete(usercontroller.deleteOneUser)
    .patch(usercontroller.updateOneUser);


userRouter.get('/get-restaurant-within/distance/:distance/lnglat/:lnglat', usercontroller.getRestaurantWithin)

export default userRouter;
