import ApiError from "../utils/apiError.js";
import { Payment } from "../models/payment.model.js";
import razorpayInstance from "../config/razorpay.js";
import {
    HTTP_BAD_GATEWAY,
    HTTP_BAD_REQUEST,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
} from "../httpStatusCode.js";

const createPaymentOrder = async (orderId, totalAmount) => {
    if (!orderId || !totalAmount) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Order ID and total amount are required"
        );
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
            error?.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            `Payment order creation failed: ${error.message}`
        );
    }
};

const capturePayment = async (paymentId, amount) => {
    if (!paymentId || !amount) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Payment ID and amount are required"
        );
    }

    try {
        // Capture the payment with Razorpay
        const capturedPayment = await razorpayInstance.payments.capture(
            paymentId,
            amount * 100, // Convert to paise
            "INR"
        );

        if (!capturedPayment) {
            throw new ApiError(
                HTTP_BAD_GATEWAY,
                "Payment capture failed: No response from Razorpay"
            );
        }

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
            throw new ApiError(HTTP_NOT_FOUND, "Payment record not found");
        }

        // Return captured payment details to the calling function
        return capturedPayment;
    } catch (error) {
        throw new ApiError(
            error?.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            `Payment capture failed: ${error.message}`
        );
    }
};

const processBankRefund = async (userId, orderItem, bankDetails) => {
    if (!bankDetails || !bankDetails.upiId) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "UPI ID is required for bank transfer"
        );
    }

    try {
        const payout = await razorpayInstance.payouts.create({
            account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
            amount: orderItem.price * 100,
            currency: "INR",
            mode: "UPI",
            purpose: "refund",
            fund_account: {
                account_type: "vpa",
                vpa: {
                    address: bankDetails.upiId,
                },
                contact: {
                    name: orderItem.userName,
                    contact: orderItem.userPhone,
                    email: orderItem.userEmail,
                },
            },
            queue_if_low_balance: true,
        });
        return payout;
    } catch (error) {
        throw new ApiError(
            error?.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            `Bank transfer (UPI) failed: ${error.message}`
        );
    }
};

const processWalletRefund = async (userId, orderItem) => {
    try {
        const refund = await razorpayInstance.refunds.create({
            payment_id: orderItem.paymentId,
            amount: orderItem.price * 100,
            speed: "normal",
        });
        return refund;
    } catch (error) {
        throw new ApiError(
            error?.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            `Wallet refund failed: ${error.message}`
        );
    }
};

const processRazorpayRefund = async (paymentId, amount) => {
    try {
        const refund = await razorpayInstance.payments.refund(paymentId, {
            amount: amount * 100,
        });
        return refund;
    } catch (error) {
        throw new ApiError(500, `Razorpay refund failed: ${error.message}`);
    }
};

export {
    createPaymentOrder,
    capturePayment,
    processBankRefund,
    processWalletRefund,
    processRazorpayRefund,
};
