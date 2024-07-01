import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    comment: {
        type: String,
        required: [true, "Review comment is required"],
        minlength: 5,
        maxlength: 500
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Review rating is required"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    food: {
        type: mongoose.Schema.ObjectId,
        ref: "food",
        required: true
    }
});

// Create a compound index on name and description to ensure uniqueness
reviewSchema.index({ user: 1, food: 1 }, { unique: true });

reviewSchema.index({rate : -1});



const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;