import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        name: {
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);