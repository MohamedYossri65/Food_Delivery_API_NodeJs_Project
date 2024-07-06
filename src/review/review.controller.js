import reviewModel from '../../database/models/reviewModel.js';
import * as factorHandler from '../Handler/factorHandler.js'
import catchAsyncError from '../utils/catchAsyncError.js';
import foodModel from './../../database/models/foodModel.js';


const addReview = factorHandler.addOne(reviewModel, 'review');

const getAllReviews = factorHandler.getAllDocuments(reviewModel, 'reviews');

const getOneReview = factorHandler.getOne(reviewModel, 'review');

const deleteOneReview = factorHandler.deleteOne(reviewModel, 'review');

const updateOneReview = factorHandler.updateOne(reviewModel, 'review');

const calcRating = catchAsyncError(async (req, res, next) => {
    
});

export { addReview, getAllReviews, deleteOneReview, updateOneReview, getOneReview, calcRating }
