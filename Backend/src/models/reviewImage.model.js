import mongoose, { Schema } from "mongoose";

const reviewImageSchema = new Schema(
    {
        reviewId: {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
        imageUrl: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

export const ReviewImage = mongoose.model("ReviewImage", reviewImageSchema);
