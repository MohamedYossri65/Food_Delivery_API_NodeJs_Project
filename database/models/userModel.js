import mongoose from "mongoose";
import crypto from 'crypto';
import cryptography from "cryptography";
import bcrypt from "bcryptjs";

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
        trim: true,
        select: false
    },
    phone: {
        type: String,
        required: [true, "the phone number is required"],
        minLength: [11, "the phone must be at least 11 characters"],
        maxLength: [15, "the phone must be at most 15 characters"],
        trim: true
    },
    role: {
        type: String,
        enum: ["user", "admin", "resturant"],
        default: "user"
    },
    passwordUpdatedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiersAt: Date,
    isActive: {
        type: Boolean,
        default: true,
        select: false
    },
    userLocation: {
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
    },
    orderedFood: {
        type: Number,
        default: 0
    },
    canceledOrder: {
        type: Number,
        default: 0
    },
    lastCancellationTime: {
        type: Date
    },
    openNow: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: 'default.jpeg'
    }
}, { timestamps: true })


userSchema.index({ userLocation: '2dsphere' });

// Middleware to hash password before saving a user document
userSchema.pre('save', async function (next) {
    // If the password is not modified, skip hashing
    if (!this.isModified('password')) return;
    // Hash the user's password with a cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.pre('save', function (next) {
    if (this.role !== 'resturant') {
        this.openNow = undefined;
    }
    next();
});
userSchema.pre('save', function () {
    if (this.role !== 'resturant') {
        this.image = undefined;
        return;
    }
    this.image = process.env.BASE_URL + 'users/' + this.image;
});
userSchema.pre('save', function () {
    if (this.role == 'resturant' || this.role == 'admin') {
        this.canceledOrder = undefined;
        this.lastCancellationTime = undefined;
        this.orderedFood = undefined;
        return;
    }
    this.openNow = undefined
});

userSchema.pre(/^find/, async function () {
    this.find({ isActive: { $ne: false } });
});

// Method to compare a candidate password with the user's stored password
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    // Compare the candidate password with the stored password
    return bcrypt.compareSync(candidatePassword, userPassword);
}

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
}

userSchema.methods.createResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = cryptography.encryptSync(resetToken);
    this.passwordResetTokenExpiersAt = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const userModel = mongoose.model("user", userSchema);

export default userModel;
