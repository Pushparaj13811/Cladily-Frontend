import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
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

        status: {
            type: String,
            required: true,
        },

        paymentGatewayOrderId: {
            type: String,
        },
        paymentGatewayPaymentId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = mongoose.model("Payment", paymentSchema);
