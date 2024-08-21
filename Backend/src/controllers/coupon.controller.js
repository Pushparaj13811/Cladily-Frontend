import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Coupon } from "../models/index.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_UNAUTHORIZED,
} from "../httpStatusCode.js";

const couponValidation = async (
    code,
    discountAmount,
    expiryDate,
    minimumPurchaseAmount
) => {
    if (!code || !discountAmount || !expiryDate || !minimumPurchaseAmount) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Please provide all the required fields"
        );
    }

    if (discountAmount <= 0 || minimumPurchaseAmount <= 0) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Discount amount and minimum purchase amount should be greater than 0"
        );
    }

    const currentDate = new Date();
    const expiry = new Date(expiryDate);

    if (expiry <= currentDate) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Expiry date should be in the future"
        );
    }

    if (minimumPurchaseAmount <= discountAmount) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Minimum purchase amount should be greater than discount amount"
        );
    }

    return { success: true, message: "Coupon is valid" };
};

const createCoupon = asyncHandler(async (req, res, next) => {
    const userId = res.user?._id;

    if (!userId || userId !== "admin") {
        throw new ApiError(HTTP_UNAUTHORIZED, "Unauthorized request");
    }

    const {
        code,
        discountAmount,
        expiryDate,
        minimumPurchaseAmount,
        isActive,
    } = req.body;

    await couponValidation(
        code,
        discountAmount,
        expiryDate,
        minimumPurchaseAmount
    );

    if (!isActive) {
        new Date(expiryDate) < new Date()
            ? (isActive = false)
            : (isActive = true);
    }

    const coupon = await Coupon({
        code,
        discountAmount,
        expiryDate,
        minimumPurchaseAmount,
        isActive,
        createdBy: userId,
    });

    await coupon.save();

    return res
        .status(HTTP_CREATED)
        .json(
            new ApiResponse(HTTP_CREATED, "Coupon created successfully", coupon)
        );
});
const getCoupons = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const coupons = await Coupon.find()
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

    return res
        .status(HTTP_OK)
        .json(
            new ApiResponse(HTTP_OK, "Coupons fetched successfully", coupons)
        );
});
const getCoupon = asyncHandler(async (req, res, next) => {
    const couponId = req.params.id;
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
        throw new ApiError(HTTP_NOT_FOUND, "Coupon not found");
    }

    return res
        .status(HTTP_OK)
        .json(new ApiResponse(HTTP_OK, "Coupon fetched successfully", coupon));
});
const updateCoupon = asyncHandler(async (req, res, next) => {
    const userId = res.user?._id;
    if (!userId || userId !== "admin") {
        throw new ApiError(HTTP_UNAUTHORIZED, "Unauthorized request");
    }

    const couponId = req.params.id;
    const coupon = await Coupon.findBy({ _id: couponId, createdBy: userId });
    if (!coupon) {
        throw new ApiError(HTTP_NOT_FOUND, "Coupon not found");
    }

    const {
        code,
        discountAmount,
        expiryDate,
        minimumPurchaseAmount,
        isActive,
    } = req.body;

    if (!isActive) {
        new Date(expiryDate) < new Date()
            ? (isActive = false)
            : (isActive = true);
    }

    await couponValidation(
        code,
        discountAmount,
        expiryDate,
        minimumPurchaseAmount
    );

    coupon.code = code;
    coupon.discountAmount = discountAmount;
    coupon.expiryDate = expiryDate;
    coupon.minimumPurchaseAmount = minimumPurchaseAmount;
    coupon.isActive = isActive;

    await coupon.save();

    return res
        .status(HTTP_OK)
        .json(new ApiResponse(HTTP_OK, "Coupon updated successfully", coupon));
});
const deleteCoupon = asyncHandler(async (req, res, next) => {
    const userId = res.user?._id;
    if (!userId || userId !== "admin") {
        throw new ApiError(HTTP_UNAUTHORIZED, "Unauthorized request");
    }

    const couponId = req.params.id;
    const coupon = await Coupon.findOneAndDelete({
        _id: couponId,
        createdBy: userId,
    });
    if (!coupon) {
        throw new ApiError(HTTP_NOT_FOUND, "Coupon not found");
    }

    return res
        .status(HTTP_OK)
        .json(new ApiResponse(HTTP_OK, "Coupon deleted successfully", null));
});

export { createCoupon, getCoupons, getCoupon, updateCoupon, deleteCoupon };
