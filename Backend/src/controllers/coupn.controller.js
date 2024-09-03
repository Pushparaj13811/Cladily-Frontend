import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Coupon from "../models/coupon.model.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
    HTTP_UNAUTHORIZED,
} from "../httpStatusCode";

const createCoupon = asyncHandler(async (req, res) => {
    // Validate User and check if user is admin or not
    // Get the coupon details from the request body
    // validate and sanitize the coupon details
    // Create a new coupon document
    // Save the coupon document to the database
    // Send the response back to the client
    // Handle any errors that occur during the process

    const { code, discountAmount, expiryDate, minimumPurchaseAmount } =
        req.body;

    if (!code || !discountAmount || !expiryDate || !minimumPurchaseAmount) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Coupon code, discount amount, expiry date, and minimum purchase amount are required"
        );
    }

    const coupon = new Coupon({
        code,
        discountAmount,
        expiryDate,
        minimumPurchaseAmount,
        createdBy: req.user._id,
    });

    try {
        await coupon.save();

        return res
            .status(HTTP_CREATED)
            .json(
                new ApiResponse(
                    HTTP_CREATED,
                    "Coupon created successfully",
                    coupon
                )
            );
    } catch (error) {
        throw new ApiError(
            error?.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            `Coupon creation failed: ${error.message}`
        );
    }
});
const getCoupons = asyncHandler(async (req, res) => {
    // get page and limit from query params
    // get all coupons from the database
    // send the response back to the client
    // handle any errors that occur during the process

    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;

    try {
        const coupons = await Coupon.find({}, { createdBy: 0 })
            .skip(limit * (page - 1))
            .limit(limit);

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Coupons fetched successfully",
                    coupons
                )
            );
    } catch (error) {
        throw new ApiError(
            error?.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            `Coupons fetch failed: ${error.message}`
        );
    }
});
const getCouponById = asyncHandler(async (req, res) => {
    // get the coupon ID from the request params
    // get the coupon details from the database
    // send the response back to the client
    // handle any errors that occur during the process

    const couponId = req.params?.id;
    if (!couponId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Coupon ID is required");
    }

    try {
        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            throw new ApiError(HTTP_NOT_FOUND, "Coupon not found");
        }

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(HTTP_OK, "Coupon fetched successfully", coupon)
            );
    } catch (error) {
        throw new ApiError(
            error?.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            `Coupon fetch failed: ${error.message}`
        );
    }
});
const updateCoupon = asyncHandler(async (req, res) => {
    // get the user details from the request.user object
    // check if user is present and is an admin
    // get the coupon ID from the request params
    // get the coupon details from the request body
    // validate and sanitize the coupon details
    // get the coupon document from the database
    // check if the coupon document exists
    // check if createdBy field in the coupon document matches the user ID
    // update the coupon document in the database
    // send the response back to the client
    // handle any errors that occur during the process

    const userId = req.user?._id;

    if (!userId || !req.user?.role === "admin") {
        throw new ApiError(HTTP_UNAUTHORIZED, "Unauthorized access");
    }

    const couponId = req.params?.id;
    if (!couponId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Coupon ID is required");
    }

    const { discountAmount, expiryDate, minimumPurchaseAmount } = req.body;

    if (!discountAmount || !expiryDate || !minimumPurchaseAmount) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "At least one field is required to update the coupon"
        );
    }

    try {
        const coupon = await Coupon.findOne({
            _id: couponId,
            createdBy: userId,
        });
        if (!coupon) {
            throw new ApiError(HTTP_NOT_FOUND, "Coupon not found");
        }

        if (discountAmount) {
            coupon.discountAmount = discountAmount;
        }
        if (expiryDate) {
            coupon.expiryDate = expiryDate;
        }
        if (minimumPurchaseAmount) {
            coupon.minimumPurchaseAmount = minimumPurchaseAmount;
        }

        await coupon.save();

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(HTTP_OK, "Coupon updated successfully", coupon)
            );
    } catch (error) {
        throw new ApiError(
            error?.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            `Coupon update failed: ${error.message}`
        );
    }
});
const deleteCoupon = asyncHandler(async (req, res) => {
    // get the user details from the request.user object
    // check if user is present and is an admin
    // get the coupon ID from the request params
    // Delete the coupon document from the database if coupon exists and createdBy field matches the user ID
    // send the response back to the client
    // handle any errors that occur during the process

    const userId = req.user?._id;
    if (!userId || !req.user?.role === "admin") {
        throw new ApiError(HTTP_UNAUTHORIZED, "Unauthorized request");
    }

    const couponId = req.params?.id;
    if (!couponId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Coupon ID is required");
    }

    try {
        const coupon = await Coupon.findOneAndDelete({
            _id: couponId,
            createdBy: userId,
        });
        if (!coupon) {
            throw new ApiError(HTTP_NOT_FOUND, "Coupon not found");
        }

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(HTTP_OK, "Coupon deleted successfully", null)
            );
    } catch (error) {
        error?.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            `Coupon deletion failed: ${error.message}`;
    }
});
const applyCoupon = asyncHandler(async (req, res) => {
    // get the coupon code from the request body
    // get the user details from the request.user object
    // get the cart total from the request body
    // get the coupon details from the database
    // check if the coupon is valid
    // calculate the discount amount
    // send the response back to the client
    // handle any errors that occur during the process

    const { code } = req.body;
    if (!code) {
        throw new ApiError(HTTP_BAD_REQUEST, "Coupon code is required");
    }
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(HTTP_UNAUTHORIZED, "Unauthorized request");
    }

    const cartTotal = req.body?.cartTotal;
    if (!cartTotal) {
        throw new ApiError(HTTP_BAD_REQUEST, "Cart total is required");
    }

    try {
        const coupon = await Coupon.findOne({ code });
        if (!coupon) {
            throw new ApiError(HTTP_NOT_FOUND, "Coupon not found");
        }

        if (!coupon.isActive) {
            throw new ApiError(HTTP_BAD_REQUEST, "Coupon is not active");
        }

        if (coupon.expiryDate < new Date()) {
            throw new ApiError(HTTP_BAD_REQUEST, "Coupon has expired");
        }

        if (coupon.minimumPurchaseAmount > cartTotal) {
            throw new ApiError(
                HTTP_BAD_REQUEST,
                "Minimum purchase amount not met"
            );
        }

        const discountAmount = coupon.discountAmount;

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Coupon applied successfully",
                    discountAmount
                )
            );
    } catch (error) {
        error?.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            `Coupon fetch failed: ${error.message}`;
    }
});
export {
    createCoupon,
    getCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
};
