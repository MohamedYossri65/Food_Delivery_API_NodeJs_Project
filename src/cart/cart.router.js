import express from 'express';
import * as cartcontroller from './cart.controller.js';
import { protectedRouts } from '../auth/auth.controller.js';

const cartRouter = express.Router();


cartRouter.route('/')
    .post(protectedRouts, cartcontroller.addToCart)
    .get(protectedRouts, cartcontroller.getLoggedUserCart);

cartRouter.put('/', protectedRouts, cartcontroller.updateQuantity);

cartRouter.route('/:id')
    .delete(protectedRouts, cartcontroller.deleteProductFromCart)

export default cartRouter;
