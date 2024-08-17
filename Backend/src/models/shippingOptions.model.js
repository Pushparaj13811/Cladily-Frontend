import mongoose, { Schema } from "mongoose";

const shippingOptionsSchema = new Schema(
    {
        optionName: {
            type: String,
            required: true,
        },
        cost: {
            type: Number,
            required: true,
        },
        deliveryTime: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const ShippingOptions = mongoose.model(
    "ShippingOptions",
    shippingOptionsSchema
);
