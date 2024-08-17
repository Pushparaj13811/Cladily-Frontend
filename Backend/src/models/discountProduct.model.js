import mongoose, { Schema } from "mongoose";

const discountProductSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
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

export const DiscountProduct = mongoose.model(
    "DiscountProduct",
    discountProductSchema
);
