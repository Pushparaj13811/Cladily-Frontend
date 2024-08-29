import mongoose, { Schema } from "mongoose";

const productVarientSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        fit: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        mrp: {
            type: Number,
            required: true,
        },
        stockQuantity: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const ProductVarient = mongoose.model(
    "ProductVarient",
    productVarientSchema
);
