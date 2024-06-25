import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true ,"the user name is required"],
        trim: true
    },
    email:{
        type: string,
        required: [true ,"the user email is required"],
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
        enum: ["user", "admin"],
        default: "user"
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
},{timestamps: true})

const userModel =mongoose.model("USER",userSchema);

export default userModel;