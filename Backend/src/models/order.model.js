import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        totalAmount: {
            type: Number,
            required: true,
        },
        shippingAddressId: {
            type: Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        paymentMethodId: {
            type: Schema.Types.ObjectId,
            ref: "PaymentMethod",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cancellationReason: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
