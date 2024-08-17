import mongoose, { Schema } from "mongoose";

const transactionHistorySchema = new Schema(
    {
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethodId: {
            type: Schema.Types.ObjectId,
            ref: "PaymentMethod",
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const TransactionHistory = mongoose.model(
    "TransactionHistory",
    transactionHistorySchema
);
