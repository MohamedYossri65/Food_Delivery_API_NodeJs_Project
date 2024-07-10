import express from 'express';
import * as cartcontroller from './cart.controller.js';
import { allowedTo, protectedRouts } from '../auth/auth.controller.js';

const cartRouter = express.Router();


cartRouter.route('/')
    .post(protectedRouts, allowedTo('user'), cartcontroller.addToCart)
    .get(protectedRouts, cartcontroller.getLoggedUserCart);

cartRouter.put('/', protectedRouts, allowedTo('user'), cartcontroller.updateQuantity);

cartRouter.route('/:id')
    .delete(protectedRouts, allowedTo('user'), cartcontroller.deleteProductFromCart)

export default cartRouter;
