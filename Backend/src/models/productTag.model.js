import mongoose, { Schema } from "mongoose";

const productTagSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        tagName: {
            type: String,
            required: true,
            lowercase: true,
        },
    },
    { timestamps: true }
);

export const ProductTag = mongoose.model("ProductTag", productTagSchema);
