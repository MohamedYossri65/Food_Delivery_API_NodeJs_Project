import mongoose, { Schema } from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true ,"the name of the food is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "the price of the food is required"],
    },
    description: {
        type: String,
        required: [true, "the description of the food is required"],
        trim: true
    },
    image: {
        type: String,
        // required: [true, "the image of the food is required"],
    },
    category: { type :Schema.Types.ObjectId ,ref: 'category' },
    resturantName: { type :Schema.Types.ObjectId ,ref: 'userModel' },
    soldOut: { type:Boolean ,default: false},
    soldedQuantity:{ type:Number ,default:0},
    discount: { type:Number ,default:0},
    rate:{ 
        type:Number ,
        min: 1,
        max: 5,
        default:0
    },
    rateSum: { type:Number ,default:0},
    rateAvg: { type:Number ,default:0},


},{timestamps: true})

const foodModel =mongoose.model("FOOD",foodSchema);

export default foodModel;