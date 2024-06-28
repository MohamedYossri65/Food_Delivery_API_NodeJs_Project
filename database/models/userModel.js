import mongoose from "mongoose";
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "the user name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "the user email is required"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "the password is required"],
        minLength: [8, "the password must be at least 8 characters"],
        maxLength: [15, "the password must be at most 15 characters"],
        trim: true
    },
    phone: {
        type: Number,
        required: [true, "the phone number is required"],
        minLength: [11, "the phone must be at least 11 characters"],
        maxLength: [15, "the phone must be at most 15 characters"],
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    passwordUpdatedAt: Date
}, { timestamps: true })

// Middleware to hash password before saving a user document
userSchema.pre('save', async function () {
    // Hash the user's password with a cost of 12
    this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare a candidate password with the user's stored password
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    // Compare the candidate password with the stored password
    return bcrypt.compareSync(candidatePassword, userPassword);
};

// Method to check if the password was changed after the JWT token was issued
userSchema.methods.changePasswordAfter = function (tokenStartAt) {
    // If passwordUpdatedAt exists, compare it to tokenStartAt
    if (this.passwordUpdatedAt) {
        // Convert passwordUpdatedAt to seconds and compare with tokenStartAt
        let inMilliseconds = this.passwordUpdatedAt.getTime() / 1000;
        return inMilliseconds > tokenStartAt;
    }
    // If passwordUpdatedAt does not exist, return false
    return false;
};

const userModel = mongoose.model("USER", userSchema);

export default userModel;
