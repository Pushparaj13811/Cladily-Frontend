import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
} from "../httpStatusCode.js";

const createReview = asyncHandler(async (req, res) => {
    // Get the product ID from the request body
    // Check if the product exists
    // Get the user ID from the request body
    // Get the review details from the request body
    // Validate and sanitize the review details
    // Create a new review
    // Save the review to the database
    // Send the response to the client with the newly created review
    // Handle errors if any occur during the process and send an error response

    const { productId, rating, comment } = req.body;

    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(HTTP_NOT_FOUND, "Product not found");
    }

    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(HTTP_BAD_REQUEST, "Rating must be between 1 and 5");
    }

    if (!comment) {
        throw new ApiError(HTTP_BAD_REQUEST, "Comment is required");
    }

    const review = new Review({
        user: userId,
        product: productId,
        rating,
        comment,
    });

    await review.save();

    return res
        .status(HTTP_CREATED)
        .json(
            new ApiResponse(HTTP_CREATED, "Review created successfully", review)
        );
});
const getReviews = asyncHandler(async (req, res) => {
    // Get the product ID from the request params
    // Check if the product exists
    // Get the page number from the query parameters or set it to 1 by default
    // Get the page size from the query parameters or set it to 10 by default
    // Get the reviews for the product
    // Send the response to the client with the reviews and pagination details
    // Handle errors if any occur during the process and send an error response

    const productId = req.params.productId;

    if (!productId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Product ID is required");
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new ApiError(HTTP_NOT_FOUND, "Product not found");
        }

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const reviews = await Review.find({ product: productId })
            .populate("user", "name email")
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Reviews retrieved successfully",
                    reviews
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});
const getReview = asyncHandler(async (req, res) => {
    // Get the review ID from the request params
    // Check if the review exists
    // Get the review details
    // Send the response to the client with the review details
    // Handle errors if any occur during the process and send an error response

    const reviewId = req.params?.reviewId;

    if (!reviewId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Review ID is required");
    }

    try {
        const review = await Review.findById(reviewId).populate(
            "user",
            "name email"
        );

        if (!review) {
            throw new ApiError(HTTP_NOT_FOUND, "Review not found");
        }

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Review retrieved successfully",
                    review
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});
const updateReview = asyncHandler(async (req, res) => {
    // Get the review ID from the request params
    // Get the user ID from the request user object
    // Check if the review exists
    // Get the review details from the request body
    // Validate and sanitize the review details
    // check if the review belongs to the user
    // Update the review details
    // Save the updated review to the database
    // Send the response to the client with the updated review
    // Handle errors if any occur during the process and send an error response

    const reviewId = req.params?.reviewId;
    const userId = req.user?._id;

    const { rating, comment } = req.body;

    if (!reviewId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Review ID is required");
    }

    if (!userId) {
        throw new ApiError(HTTP_BAD_REQUEST, "User ID is required");
    }
    const reviewUpdate = [];
    if (rating) {
        reviewUpdate.push({ rating });
    }
    if (comment) {
        reviewUpdate.push({ comment });
    }

    try {
        const review = await Review.findByIdAndUpdate(
            { reviewId, uploadeby: userId },
            {
                ...reviewUpdate,
            }
        );

        if (!review) {
            throw new ApiError(HTTP_NOT_FOUND, "Review not found");
        }

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(HTTP_OK, "Review updated successfully", review)
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});
const deleteReview = asyncHandler(async (req, res) => {
    // Get the review ID from the request params
    // Get the user ID from the request user object
    // Check if the review exists
    // Check if the review belongs to the user
    // Delete the review from the database
    // Send the response to the client with a success message
    // Handle errors if any occur during the process and send an error response

    const reviewId = req.params?.reviewId;
    const userId = req.user?._id;

    if (!reviewId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Review ID is required");
    }

    if (!userId) {
        throw new ApiError(HTTP_BAD_REQUEST, "User ID is required");
    }

    try {
        const review = await Review.findOneAndDelete({
            _id: reviewId,
            user: userId,
        });

        if (!review) {
            throw new ApiError(HTTP_NOT_FOUND, "Review not found");
        }

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(HTTP_OK, "Review deleted successfully", null)
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

export { createReview, getReviews, getReview, updateReview, deleteReview };
