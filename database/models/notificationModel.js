import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    reciever: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    content: String
    ,
    order:{
        type: mongoose.Schema.ObjectId,
        ref: "order",
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: Date,

}, {
    timestamps: true,
})

notificationSchema.pre(/^find/, function () {
    this.populate({ path: 'sender', select: 'name' }).
        populate({ path: 'reciever', select: 'name' }).
        populate({ path: 'order' ,select:'items'})
})

const notificationModel = mongoose.model("notification", notificationSchema);

export default notificationModel;