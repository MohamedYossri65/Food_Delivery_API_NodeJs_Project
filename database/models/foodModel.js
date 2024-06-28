import mongoose, { Schema } from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true ,"the name of the food is required"],
        trim: true
    },
    slugName: {
        type: String
    },
    price: {
        type: Number,
        required: [true, "the price of the food is required"],
    },
    description: {
        type: String,
        maxlength : [300 , 'length of the description cant be more than 300 characters'],
        minlength : [20 , 'length of description cant be less than 20 characters'],
        required: [true, "the description of the food is required"],
        trim: true
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
        default:1
    },
    rateSum: { type:Number ,default:0},
    rateAvg: { type:Number ,default:0},


},{timestamps: true})


// Middleware to generate a slug from the food name before saving a food document
foodSchema.pre('save', function(next) {
    // Generate a slug from the food name
    this.slugName = slugify(this.name);
    // Proceed to the next middleware or save the document
    next();
});

// Create a compound index on name and description to ensure uniqueness
foodSchema.index({ name: 1, description: 1 }, { unique: true });

const foodModel =mongoose.model("FOOD",foodSchema);

export default foodModel;