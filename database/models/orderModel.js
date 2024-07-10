import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    items: [
        {
            food: {
                type: mongoose.Schema.ObjectId,
                ref: "food",
                required: true
            },
            restaurant: {
                type: mongoose.Schema.ObjectId,
                ref: "user"
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
        ref: "user",
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentMethode: {
        type: String,
        enum: ['card', 'cash'],
        default: 'cash'
    },
    statusOfOrder: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paidAt: Date,
    deliveredAt: Date,
    shippingAddress: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: {
            type: String,
            trim: true
        }
    }
}, {
    timestamps: true,
})

orderSchema.index({ shippingAddress: '2dsphere' });

orderSchema.pre(/^find/, function () {
    this.populate({ path: 'user', select: 'name phone' })
        .populate({ path: 'items.food', select: 'name' }).sort({ createdAt: -1 })
})

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;