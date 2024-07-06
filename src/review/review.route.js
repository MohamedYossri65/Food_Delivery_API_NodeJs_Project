import express from 'express';
import * as reviewController from './review.controller.js';
import { protectedRouts } from '../auth/auth.controller.js';

const reviewRouter = express.Router();


reviewRouter.route('/')
    .post(protectedRouts ,reviewController.addReview)
    .get(reviewController.getAllReviews);   

    reviewRouter.get('/calcRating' ,reviewController.calcRating )
reviewRouter.route('/:id')
    .get(reviewController.getOneReview)
    .delete(reviewController.deleteOneReview)
    .patch(reviewController.updateOneReview);

export default reviewRouter;
