import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        productVarientId: {
            type: Schema.Types.ObjectId,
            ref: "ProductVarient",
            required: true,
        },
        status: {
            type: String,
            default: "Pending",
            required: true,
        },
    },
    { timestamps: true }
);

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);
