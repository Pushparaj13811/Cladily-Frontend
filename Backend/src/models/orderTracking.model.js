import mongoose, { Schema } from "mongoose";

const orderTrackingSchema = new Schema(
    {
        trackingNumber: {
            type: String,
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        carrierName: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const OrderTracking = mongoose.model(
    "OrderTracking",
    orderTrackingSchema
);
