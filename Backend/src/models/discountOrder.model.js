import mongoose, { Schema } from "mongoose";

const discountOrderSchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        discountId: {
            type: Schema.Types.ObjectId,
            ref: "Discount",
            required: true,
        },
    },
    { timestamps: true }
);

export const DiscountOrder = mongoose.model(
    "DiscountOrder",
    discountOrderSchema
);
