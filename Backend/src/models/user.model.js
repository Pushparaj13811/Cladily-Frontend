import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
        },
        phone: {
            type: Number,
        },
        dateOfBirth: {
            type: Date,
        },
        addressId: {
            type: Schema.Types.ObjectId,
            ref: "Address",
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        authToken: {
            type: String,
        },
        resetToken: {
            type: String,
        },
        resetTokenExpires: {
            type: Date,
        },
        googleId: {
            type: String,
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationTokenExpires: {
            type: Date,
        },
        usedCoupons: [
            {
                type: Schema.Types.ObjectId,
                ref: "Coupon",
            },
        ],
    },
    { timestamps: true }
);

userSchema.plugin(mongooseAggregatePaginate);


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            role: this.role,
        },
        process.env.JWT_SECRET
    );
};

userSchema.methods.generateResetToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

userSchema.methods.generateVerificationToken = function () {
    const verificationToken = crypto.randomBytes(32).toString("hex");

    this.emailVerificationToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");
    this.emailVerificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours

    return this.emailVerificationToken;
};

export const User = mongoose.model("User", userSchema);
