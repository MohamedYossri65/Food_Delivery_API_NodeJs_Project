import express from 'express';
import * as ordercontroller from './order.controller.js';
import { allowedTo, protectedRouts } from '../auth/auth.controller.js';

const orderRouter = express.Router();


orderRouter.route('/')
    .post(protectedRouts, allowedTo('user'), ordercontroller.addOrder); 

orderRouter.get('/restaurant', protectedRouts, allowedTo('resturant'),
    ordercontroller.getAllOrdersforOnerestaurant)

orderRouter.get('/user', protectedRouts, allowedTo('user'),
    ordercontroller.getAllOrdersforOneUser);

orderRouter.route('/:id')
//     .get(ordercontroller.getOneOrder)
    .patch(protectedRouts, allowedTo('user'),ordercontroller.cancelOrder)
//     .patch(ordercontroller.updateOneOrder);

export default orderRouter;
