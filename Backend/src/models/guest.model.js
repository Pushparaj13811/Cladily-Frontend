import mongoose, { Schema } from "mongoose";

const guestSchema = new Schema(
    {
        sessionId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Guest = mongoose.model("Guest", guestSchema);
