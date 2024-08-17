import mongoose, { Schema } from "mongoose";

const orderStatusSchema = new Schema(
    {
        statusId: {
            type: Schema.Types.ObjectId,
            ref: "Status",
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
    },
    { timestamps: true }
);

export const OrderStatus = mongoose.model("OrderStatus", orderStatusSchema);
