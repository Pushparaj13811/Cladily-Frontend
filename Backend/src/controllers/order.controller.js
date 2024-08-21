import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { ShoppingCart } from "../models/shoppingCart.model.js";
import { Address } from "../models/address.model.js";
import { Payment } from "../models/payment.model.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_NOT_FOUND,
    HTTP_OK,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_UNAUTHORIZED,
} from "../httpStatusCode.js";
import {
    capturePayment,
    createPaymentOrder,
} from "../services/payment.service.js";

const createOrder = asyncHandler(async (req, res) => {
    // Validate User
    // Fetch Cart and Shipping Address
    // Create Order
    // Create Order Items
    // Save Order and Order Items
    // Handle Payment if not Cash On Delivery
    // Save Payment Details
    // Rollback Order Creation if Payment Fails
    // Clear the Cart
    // Send Response

    const userId = req.user?._id;
    const { paymentMethod } = req.body;

    const isUserVerified = req.user?.emailVerified;

    if (!isUserVerified) {
        redirectUrl = `${process.env.CLIENT_URL}/verify-email`; // This is just a reference URL
        throw new ApiError(HTTP_UNAUTHORIZED, "Please verify your email");
    }
    if (!userId) {
        throw new ApiError(HTTP_UNAUTHORIZED, "Please login to continue");
    }

    if (!paymentMethod) {
        throw new ApiError(HTTP_BAD_REQUEST, "Payment method is required");
    }

    const [cart, shippingAddress] = await Promise.all([
        ShoppingCart.findOne({ userId }).populate("items.productVarientId"),
        Address.findOne({ userId }),
    ]);

    if (!cart || !shippingAddress) {
        throw new ApiError(
            HTTP_NOT_FOUND,
            "Cart or Shipping Address not found"
        );
    }

    const order = new Order({
        userId,
        shippingAddressId: shippingAddress._id,
        paymentMethod,
        totalAmount: cart.totalAmount,
        status: "Pending",
    });

    const orderItems = cart.items.map((item) => ({
        orderId: order._id,
        productVarientId: item.productVarientId,
        quantity: item.quantity,
        price: item.price,
    }));

    await Promise.all([order.save(), OrderItem.insertMany(orderItems)]);

    if (paymentMethod !== "Cash On Delivery") {
        try {
            const paymentOrder = await createPaymentOrder(
                order._id,
                cart.totalAmount
            );
            const capturedPayment = await capturePayment(
                paymentOrder.id,
                cart.totalAmount
            );

            if (capturedPayment.status !== "captured") {
                throw new ApiError(
                    HTTP_INTERNAL_SERVER_ERROR,
                    "Payment capture failed"
                );
            }

            const payment = new Payment({
                orderId: order._id,
                amount: cart.totalAmount,
                status: "Completed",
                paymentGatewayOrderId: paymentOrder.id,
                paymentGatewayPaymentId: capturedPayment.id,
            });

            await payment.save();
        } catch (error) {
            await Order.deleteOne({ _id: order._id });
            throw new ApiError(
                HTTP_INTERNAL_SERVER_ERROR,
                `Payment processing failed: ${error.message}`
            );
        }
    }

    await ShoppingCart.findByIdAndUpdate(cart._id, { $set: { items: [] } });

    res.status(HTTP_OK).json(
        new ApiResponse(HTTP_OK, "Order created successfully", {
            order,
            paymentStatus:
                paymentMethod === "Cash On Delivery" ? "Pending" : "Paid",
        })
    );
});

const getOrders = asyncHandler(async (req, res) => {
    // Get the user ID from the request object
    // Fetch all orders for the user from the database and sort them by creation date in descending order
    // Populate the order items with product details and exclude the user ID and version field
    // Send the response with the orders
    // Handle any errors

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(HTTP_UNAUTHORIZED, "Please login to continue");
    }

    try {
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate({
                path: "orderItems",
                populate: {
                    path: "productVarientId",
                    select: "name price",
                },
            })
            .select("-userId -__v");

        res.status(HTTP_OK).json(
            new ApiResponse(HTTP_OK, "Orders fetched successfully", { orders })
        );
    } catch (error) {
        throw new ApiError(
            error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
        );
    }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    // Validate User
    // Fetch Order
    // Update Order Status
    // Send Response

    const sellerId = req.user?._id;
    const { orderId, status } = req.body;

    if (!sellerId) {
        throw new ApiError(HTTP_UNAUTHORIZED, "Please login to continue");
    }
    if (req.user?.role !== "admin") {
        throw new ApiError(
            HTTP_UNAUTHORIZED,
            "You are not authorized to update order status"
        );
    }

    if (!orderId || !status) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Order ID and status are required"
        );
    }

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
        throw new ApiError(HTTP_NOT_FOUND, "Order not found");
    }

    order.status = status;
    await order.save();

    res.status(HTTP_OK).json(
        new ApiResponse(HTTP_OK, "Order status updated successfully", {
            order,
        })
    );
});

const cancelOrder = asyncHandler(async (req, res) => {
    const { orderId, reason, role } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(HTTP_UNAUTHORIZED, "Please login to continue");
    }

    const order = await Order.findById(orderId);
    const orderStatus = order.status;
    if (!order) {
        throw new ApiError(HTTP_NOT_FOUND, "Order not found");
    }

    if (role === "buyer" && order.userId.toString() !== userId.toString()) {
        throw new ApiError(
            HTTP_FORBIDDEN,
            "You are not authorized to cancel this order"
        );
    }

    if (order.status === "Cancelled") {
        throw new ApiError(HTTP_BAD_REQUEST, "Order is already cancelled");
    }

    if (role === "auto" && order.deliveryAttempts >= 3) {
        order.status = "Cancelled";
        order.cancellationReason = `Auto-cancelled due to 3 failed delivery attempts`;
    } else if (role === "buyer") {
        order.status = "Cancelled";
        order.cancellationReason = `Cancelled by buyer: ${reason}`;
    } else if (role === "deliveryPartner") {
        order.status = "Cancelled";
        order.cancellationReason = `Cancelled by delivery partner: ${reason}`;
    } else {
        throw new ApiError(HTTP_BAD_REQUEST, "Invalid cancellation role");
    }

    const payment = await Payment.findOne({ orderId: order._id });
    if (payment && payment.status === "Completed") {
        const refund = await processRefund(
            payment.paymentGatewayPaymentId,
            payment.amount
        );
        if (!refund) {
            order.status = orderStatus;
            order.cancellationReason = null;
            throw new ApiError(
                HTTP_INTERNAL_SERVER_ERROR,
                "Refund processing failed"
            );
        }
        order.refundStatus = "Processed";
    }

    await order.save();

    res.status(HTTP_OK).json(
        new ApiResponse(HTTP_OK, "Order cancelled successfully", {
            orderId: order._id,
            status: order.status,
            cancellationReason: order.cancellationReason,
            refundStatus: order.refundStatus || "N/A",
        })
    );
});

const cancelOrderItems = asyncHandler(async (req, res) => {
    const { orderId, itemIds, reason } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(HTTP_UNAUTHORIZED, "Please login to continue");
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(HTTP_NOT_FOUND, "Order not found");
    }

    if (order.userId.toString() !== userId.toString()) {
        throw new ApiError(
            HTTP_FORBIDDEN,
            "You are not authorized to cancel items in this order"
        );
    }

    const itemsToCancel = await OrderItem.find({
        _id: { $in: itemIds },
        orderId,
    });
    if (itemsToCancel.length !== itemIds.length) {
        throw new ApiError(HTTP_NOT_FOUND, "Some order items not found");
    }

    await OrderItem.updateMany(
        { _id: { $in: itemIds } },
        { $set: { status: "Cancelled", cancellationReason: reason } }
    );

    const remainingItems = await OrderItem.find({
        orderId,
        status: { $ne: "Cancelled" },
    });
    if (remainingItems.length === 0) {
        order.status = "Cancelled";
        order.cancellationReason = `All items cancelled: ${reason}`;
    }

    await order.save();

    const payment = await Payment.findOne({ orderId: order._id });
    if (payment && payment.status === "Completed") {
        const totalAmountToRefund = await OrderItem.aggregate([
            { $match: { _id: { $in: itemIds } } },
            { $group: { _id: null, totalAmount: { $sum: "$price" } } },
        ]);

        if (totalAmountToRefund.length > 0) {
            const refund = await processRefund(
                payment.razorpayPaymentId,
                totalAmountToRefund[0].totalAmount
            );
            if (!refund) {
                throw new ApiError(
                    HTTP_INTERNAL_SERVER_ERROR,
                    "Refund processing failed"
                );
            }
            order.refundStatus = "Processed";
        }
    }

    res.status(HTTP_OK).json(
        new ApiResponse(HTTP_OK, "Order items cancelled successfully", {
            orderId: order._id,
            status: order.status,
            cancellationReason: order.cancellationReason,
            refundStatus: order.refundStatus || "N/A",
        })
    );
});
export {
    createOrder,
    getOrders,
    updateOrderStatus,
    cancelOrder,
    cancelOrderItems,
};
