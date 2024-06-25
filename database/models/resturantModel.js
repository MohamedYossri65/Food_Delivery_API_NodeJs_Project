import mongoose from "mongoose";

const resturantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true ,"the resturant name is required"],
        trim: true
    },
    email:{
        type: string,
        required: [true ,"the resturant email is required"],
        unique: true
    },
    password:{
        type: Number,
        required: [true ,"the password is required"],
        trim: true
    },
    phone:{
        type: Number,
        required: [true ,"the phone number is required"],
        trim: true
    },
    address:{
        type: String,
        trim: true
    },
    role:{
        type: String,
        enum: [ "admin" ,"resturant"],
        default: "resturant"
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    opennenseTime:{
        type: Number,
    },closeTime:{
        type: Number
    },
    closedDays:{
        type: string,
        enum:["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
    }
    ,openNow:{
        type: Boolean,
        default: true
    }
},{timestamps: true})

const resturantModel =mongoose.model("RESTURANT",resturantSchema);

export default resturantModel;