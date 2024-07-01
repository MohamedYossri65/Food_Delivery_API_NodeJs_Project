import express from 'express';
import * as usercontroller from './user.controller.js';

const userRouter = express.Router();


userRouter.route('/')
    .post(usercontroller.addUser)
    .get(usercontroller.getAllUsers);   


userRouter.route('/:id')
    .get(usercontroller.getOneUser)
    .delete(usercontroller.deleteOneUser)
    .patch(usercontroller.updateOneUser);

export default userRouter;
