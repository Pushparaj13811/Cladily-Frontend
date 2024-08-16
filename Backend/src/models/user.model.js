import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
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
        googleId: {
            type: String,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.isPasswordCorrect = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

UserSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            role: this.role,
        },
        process.env.AUTH_TOKEN_SECRET,
        {
            expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN,
        }
    );
};

export const User = mongoose.model("User", userSchema);
