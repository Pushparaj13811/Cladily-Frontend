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
        GarmentType: {
            type: String,
            required: true,
        },
        specification: [
            {
                key: {
                    type: String,
                    required: true,
                },
                value: {
                    type: String,
                    required: true,
                },
            },
        ],
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
