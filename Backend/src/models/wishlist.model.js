import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productVarientId: {
            type: Schema.Types.ObjectId,
            ref: "ProductVarient",
            required: true,
        },
    },
    { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
