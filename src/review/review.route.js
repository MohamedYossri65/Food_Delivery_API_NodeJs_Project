import express from 'express';
import * as reviewController from './review.controller.js';
import { allowedTo, protectedRouts } from '../auth/auth.controller.js';

const reviewRouter = express.Router();


reviewRouter.route('/')
    .post(protectedRouts, allowedTo('user'),reviewController.addReview)
    .get(reviewController.getAllReviews);   

    reviewRouter.get('/calcRating' ,reviewController.calcRating )
reviewRouter.route('/:id')
    .get(protectedRouts, allowedTo('user'),reviewController.getOneReview)
    .delete(protectedRouts, allowedTo('user'),reviewController.deleteOneReview)
    .patch(protectedRouts, allowedTo('user'),reviewController.updateOneReview);

export default reviewRouter;
