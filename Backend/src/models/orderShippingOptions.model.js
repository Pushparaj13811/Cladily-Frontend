import mongoose, { Schema } from "mongoose";

const orderShippingOptionsSchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        shippingOptionId: {
            type: Schema.Types.ObjectId,
            ref: "ShippingOption",
            required: true,
        },
    },
    { timestamps: true }
);

export const OrderShippingOption = mongoose.model(
    "OrderShippingOption",
    orderShippingOptionsSchema
);
