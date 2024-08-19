import mongoose, { Schema } from "mongoose";

const shoppingCartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        guestId: {
            type: Schema.Types.ObjectId,
            ref: "Guest",
        },
    },
    { timestamps: true }
);

export const SchoppingCart = mongoose.model("ShoppingCart", shoppingCartSchema);
