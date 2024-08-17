import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        discountAmount: {
            type: Number,
            required: true,
        },
        expiryDate: {
            type: Date,
            required: true,
        },
        minimumPurchaseAmount: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
