import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
    {
        paymentId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        refundId: {
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

const Refund = mongoose.model("Refund", refundSchema);

export default Refund;
