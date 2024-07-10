import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "the name of the category is required"],
        trim: true
    },
    slugName: {
        type: String,
    },
    image: {
        type: String,
        required: [true, "the image of the category is required"],
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})




categorySchema.pre('save', function () {
    this.slugName = slugify(this.name);
})


categorySchema.pre('save', function () {
    this.image = process.env.BASE_URL + 'food/' + this.image;
});

categorySchema.pre(/^find/, function () {
    this.populate({
        path: 'foods',
        select: '-_id -__v -createdAt -updatedAt'
    })
})

categorySchema.virtual('foods', {
    ref: 'food',
    foreignField: 'category',
    localField: '_id'
})

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel;