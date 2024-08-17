import { text } from "express";
import mongoose, { Schema } from "mongoose";

const returnRequestSchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        returnReason: {
            type: text,
            required: true,
        },
        requestDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    },
    { timestamps: true }
);

export const ReturnRequest = mongoose.model(
    "ReturnRequest",
    returnRequestSchema
);
