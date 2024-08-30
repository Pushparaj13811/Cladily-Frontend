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
            required: [true, "Size is required"],
            enum: ["S", "M", "L", "X" ,"XL", "XXL"],
        },
        fit: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: [true, "Color is required"],
        },
        mrp: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price must be a positive number"],
        },
        stockQuantity: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock must be a positive number"],
        },
    },
    { timestamps: true }
);

export const ProductVarient = mongoose.model(
    "ProductVarient",
    productVarientSchema
);
