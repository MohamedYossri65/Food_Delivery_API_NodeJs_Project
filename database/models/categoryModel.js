import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true ,"the name of the category is required"],
        trim: true
    },
    slugName:{
        type: String,
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

categorySchema.pre('save', function(){
    this.slugName = slugify(this.name);
})


const categoryModel =mongoose.model("CATEGORY",categorySchema);

export default categoryModel;