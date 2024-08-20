import mongoose, { Schema } from "mongoose";

const reviewImageSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reviewId: {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
        imageUrl: [
            {
                type: [String],
                required: true,
            },
        ],
    },
    { timestamps: true }
);

export const ReviewImage = mongoose.model("ReviewImage", reviewImageSchema);
