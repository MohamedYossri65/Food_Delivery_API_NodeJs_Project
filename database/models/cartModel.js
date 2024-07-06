import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    item: [
        {
            food: {
                type: mongoose.Schema.ObjectId,
                ref: "food",
            },
            restaurant: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
                required: true
            },
            quantity: {
                type: Number,
                min: 1
            },
            price: {
                type: Number,
            },
            size: {
                type: String,
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    },
    totalPrice: {
        type: Number
    }
}, {
    timestamps: true,
})

cartSchema.index({ shippingAddress: '2dsphere' });

cartSchema.pre(/^find/, function () {
    this.populate({ path: 'user', select: 'name' });
    this.select('-__v -createdAt -updatedAt')
})
cartSchema.pre(/^find/, function () {
    this.populate({ path: 'item.food', select: 'name price _id' }).
        populate({ path: 'item.restaurant', select: 'name' });
    this.select('-__v -createdAt -updatedAt')
})


const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;