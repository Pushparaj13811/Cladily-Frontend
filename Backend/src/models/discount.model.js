import mongoose, { Schema } from "mongoose";

const discountSchema = new Schema(
    {
        discountAmount: {
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        discountType: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Discount = mongoose.model("Discount", discountSchema);
