import ApiError from "../utils/apiError.js";
import { HTTP_BAD_REQUEST } from "../httpStatusCode.js";
import { Coupon } from "../models/coupon.model.js";

const validateCouponDiscount = async (couponCode, totalAmount) => {
    // Get the coupon code from the request body
    // Check if the coupon code is provided
    // Check if the coupon code is valid
    // Get the total amount from the request body
    // Check if the total amount is provided
    // Check if the total amount is a number
    // Check if the total amount is greater than 0
    // Check if the minimum amount is greater than the total amount
    // Check if the discount type is percentage
    // Calculate the discount amount
    // Return the discount amount
    // Handle any errors

    if (!couponCode) {
        throw new ApiError(HTTP_BAD_REQUEST, "Coupon code is required");
    }
    if (!totalAmount) {
        throw new ApiError(HTTP_BAD_REQUEST, "Total amount is required");
    }
    if (isNaN(totalAmount)) {
        throw new ApiError(HTTP_BAD_REQUEST, "Total amount must be a number");
    }
    if (totalAmount <= 0) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Total amount must be greater than 0"
        );
    }

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
        throw new ApiError(HTTP_BAD_REQUEST, "Invalid coupon code");
    }

    if (coupon.expiryDate < new Date()) {
        throw new ApiError(HTTP_BAD_REQUEST, "Coupon has expired");
    }
    if (!coupon.isActive) {
        throw new ApiError(HTTP_BAD_REQUEST, "Coupon is not active");
    }

    if (coupon.minimumPurchaseAmount > totalAmount) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            `Minimum purchase amount is ${coupon.minimumPurchaseAmount}`
        );
    }

    if (coupon.discountType === "percentage") {
        const discountAmount = (coupon.discountAmount / 100) * totalAmount;
        return discountAmount;
    }

    return coupon.discountAmount;
};



export { validateCouponDiscount };
