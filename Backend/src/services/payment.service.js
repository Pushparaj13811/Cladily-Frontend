import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { Payment } from "../models/payment.model.js";
import razorpayInstance from "../config/razorpay.js";

const createPaymentOrder = asyncHandler(async (orderId, totalAmount) => {
    if (!orderId || !totalAmount) {
        throw new ApiError(400, "Order ID and total amount are required");
    }

    // Convert total amount to paise (Razorpay requires the amount in paise)
    const amountInPaise = totalAmount * 100;

    try {
        // Create the payment order using Razorpay
        const paymentOrder = await razorpayInstance.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: orderId.toString(),
            payment_capture: 1,
        });

        // Save payment details to the database
        const payment = new Payment({
            orderId,
            amount: totalAmount,
            status: "Pending",
            razorpayOrderId: paymentOrder.id,
        });

        await payment.save();

        // Return payment order details to the calling function
        return paymentOrder;
    } catch (error) {
        throw new ApiError(
            500,
            `Payment order creation failed: ${error.message}`
        );
    }
});

const capturePayment = asyncHandler(async (paymentId, amount) => {
    if (!paymentId || !amount) {
        throw new ApiError(400, "Payment ID and amount are required");
    }

    try {
        // Capture the payment with Razorpay
        const capturedPayment = await razorpayInstance.payments.capture(
            paymentId,
            amount * 100, // Convert to paise
            "INR"
        );

        // Update payment status in the database
        const payment = await Payment.findOneAndUpdate(
            { razorpayPaymentId: paymentId },
            {
                status: "Completed",
                capturedAmount: amount,
            },
            { new: true }
        );

        if (!payment) {
            throw new ApiError(404, "Payment record not found");
        }

        // Return captured payment details to the calling function
        return capturedPayment;
    } catch (error) {
        throw new ApiError(500, `Payment capture failed: ${error.message}`);
    }
});

export { createPaymentOrder, capturePayment };
