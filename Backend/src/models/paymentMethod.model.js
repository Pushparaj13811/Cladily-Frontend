import mongoose, { Schema } from "mongoose";

const paymentMethodSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        paymentType: {
            type: String,
            enum: ["COD", "UPI", "Credit Card", "Debit Card"],
            required: true,
        },
        cardNumber: {
            type: String,
        },
        expiryDate: {
            type: Date,
        },
        cardHolderName: {
            type: String,
        },
        upiId: {
            type: String,
        },
    },
    { timestamps: true }
);

export const PaymentMethod = mongoose.model(
    "PaymentMethod",
    paymentMethodSchema
);
