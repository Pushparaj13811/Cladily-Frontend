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
    },
    { timestamps: true }
);

export const CouponOrder = mongoose.model("CouponOrder", couponOrderSchema);
