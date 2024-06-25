import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true ,"the name of the category is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "the description of the category is required"],
        trim: true
    },
    image: {
        type: String,
        required: [true, "the image of the category is required"],
        trim: true
    }
},{timestamps: true})

const categoryModel =mongoose.model("CATEGORY",categorySchema);

export default categoryModel;