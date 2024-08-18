import mongoose, { Schema } from "mongoose";

const productImageSchema = new Schema(
    {
        color: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        altText: {
            type: String,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        isPrimary: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const ProductImage = mongoose.model("ProductImage", productImageSchema);
