import mongoose, { Schema } from "mongoose";

const couponOrderSchema = new Schema(
    {
        couponId: {
            type: Schema.Types.ObjectId,
            ref: "Coupon",
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        discountAmount: {
            type: Number,
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const CouponOrder = mongoose.model("CouponOrder", couponOrderSchema);
