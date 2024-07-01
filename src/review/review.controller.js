import reviewModel from '../../database/models/reviewModel.js';
import * as factorHandler from '../Handler/factorHandler.js'
import catchAsyncError from '../utils/catchAsyncError.js';


const addReview = factorHandler.addOne(reviewModel, 'review');

const getAllReviews = factorHandler.getAllDocuments(reviewModel, 'reviews');

const getOneReview = factorHandler.getOne(reviewModel, 'review');

const deleteOneReview = factorHandler.deleteOne(reviewModel, 'review');

const updateOneReview = factorHandler.updateOne(reviewModel, 'review');

const calcRating = catchAsyncError(async (req, res, next) => {
    const result = await reviewModel.aggregate([
        {
            $group: {
                _id: '$food',
                review: { $addToSet: "$comment" } ,
                number: { $sum: 1 },
                averageRating: { $avg: "$rating" }
            }
        }
    ])
    console.log(result);

    // Respond with success message and the fetched document
    res.status(200).json({
        status: "success",
        message: `reviews found`,
        data: result
    });
});

export { addReview, getAllReviews, deleteOneReview, updateOneReview, getOneReview, calcRating }
