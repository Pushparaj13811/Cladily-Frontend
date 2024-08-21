import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Wishlist } from "../models/wishlist.model.js";
import { ProductVarient } from "../models/productVarient.model.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
    HTTP_UNAUTHORIZED,
} from "../httpStatusCode.js";
import asyncHandler from "../utils/asyncHandler.js";

const addToWishlist = asyncHandler(async (req, res) => {
    // Get the user id from the request object
    // Check if the user exists and throw an error if not
    // Get the product varient id from the request body
    // Check if the product varient exists
    // Check if the product varient is already in the user's wishlist
    // If it is, throw an error
    // If it is not, add it to the wishlist
    // Return the updated wishlist
    // Handle any errors

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(
            HTTP_UNAUTHORIZED,
            "You must be logged in to add to wishlist"
        );
    }

    const productVarientId = req.body?.productVarientId;

    if (!productVarientId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Product varient id is required");
    }

    const session = await Wishlist.startSession();
    session.startTransaction();

    try {
        const product =
            await ProductVarient.findById(productVarientId).session(session);

        if (!product) {
            throw new ApiError(HTTP_NOT_FOUND, "Product varient not found");
        }

        const wishlistItem = await Wishlist.findOne({
            productVarientId,
            userId,
        }).session(session);

        if (wishlistItem) {
            throw new ApiError(
                HTTP_BAD_REQUEST,
                "Product varient already in wishlist"
            );
        }

        const newWishlistItem = new Wishlist.create({
            userId,
            productVarientId,
        });

        await newWishlistItem.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Product added to wishlist",
                    newWishlistItem
                )
            );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        throw new ApiError(
            error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
        );
    }
});

const removeFromWishlist = asyncHandler(async (req, res) => {
    // Get the user id from the request object
    // Check if the user exists and throw an error if not
    // Get the product varient id from the request body
    // Check if the product varient exists
    // Check if the product varient is in the user's wishlist
    // If it is not, throw an error
    // If it is, remove it from the wishlist
    // Return the updated wishlist
    // Handle any errors

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(
            HTTP_UNAUTHORIZED,
            "You must be logged in to remove from wishlist"
        );
    }

    const productVarientId = req.body?.productVarientId;

    if (!productVarientId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Product varient id is required");
    }

    const session = await Wishlist.startSession();
    session.startTransaction();

    try {
        const product =
            await ProductVarient.findById(productVarientId).session(session);

        if (!product) {
            throw new ApiError(HTTP_NOT_FOUND, "Product varient not found");
        }

        const wishlistItem = await Wishlist.findOneAndDelete({
            productVarientId,
            userId,
        }).session(session);

        if (!wishlistItem) {
            throw new ApiError(
                HTTP_NOT_FOUND,
                "Product varient not in wishlist"
            );
        }

        await session.commitTransaction();
        session.endSession();

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(HTTP_OK, "Product removed from wishlist", null)
            );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        throw new ApiError(
            error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
        );
    }
});

export { addToWishlist, removeFromWishlist };
