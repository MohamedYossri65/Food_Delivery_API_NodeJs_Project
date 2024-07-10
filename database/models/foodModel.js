import mongoose from "mongoose";
import slugify from "slugify";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "the name of the food is required"],
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
        maxlength: [300, 'length of the description cant be more than 300 characters'],
        minlength: [20, 'length of description cant be less than 20 characters'],
        required: [true, "the description of the food is required"],
        trim: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'category',
        required: [true, "the category id is required"]
    },
    resturant: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, "the resturant id is required"]
    },
    rateSum: {
        type: Number,
        default: 0
    },
    rateAvg: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    soldOut: {
        type: Boolean,
        default: false
    },
    soldedQuantity: {
        type: Number,
        default: 0
    },
    imageCover: String,
    images: [String]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Create a compound index on name and description to ensure uniqueness
foodSchema.index({ name: 1, description: 1 }, { unique: true });

foodSchema.index({ price: 1, rateAvg: -1 })

foodSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'food',
    localField: '_id',
})

// Middleware to generate a slug from the food name before saving a food document
foodSchema.pre('save', function (next) {
    // Generate a slug from the food name
    this.slugName = slugify(this.name);
    // Proceed to the next middleware or save the document
    next();
});

foodSchema.pre('save', function () {
    this.imageCover = process.env.BASE_URL + 'food/' + this.imageCover;

    this.images = this.images.map((image)=> image = process.env.BASE_URL + 'food/' + image);
});

foodSchema.pre(/^findOne/, function () {
    this.populate({
        path: 'reviews',
        select: '-__v -createdAt -updatedAt '
    })
    this.select('-__v -createdAt -updatedAt ')
})
foodSchema.pre(/^find/, function () {
    this.sort({rateSum: -1 ,soldedQuantity: -1 })
})

const foodModel = mongoose.model("food", foodSchema);

export default foodModel;