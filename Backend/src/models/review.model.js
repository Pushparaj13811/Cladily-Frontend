import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        imageUrl: [
            {
                type: Schema.Types.ObjectId,
                ref: "reviewImage",
            },
        ],
    },
    { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
