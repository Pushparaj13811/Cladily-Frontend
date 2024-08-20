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
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ReviewImage } from "../models/reviewImage.model.js";
import mongoose from "mongoose";

const createReview = asyncHandler(async (req, res) => {
    // Get the product ID from the request body
    // Check if the product exists
    // Get the user ID from the request body
    // Get the review details from the request body
    // Validate and sanitize the review details
    // Get images by user of the product
    // if images are provided, upload them to the cloudinary
    // save the image urls to the database in review images model
    // Check if the user has already reviewed the product throw an error if they have already reviewed the product
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

    const images = req.files?.images;
    const imageUrls = [];

    const session = await Review.startSession();
    session.startTransaction();
    try {
        if (images && images.length > 0) {
            const imageUrls = images.map((image) => {
                return image.path;
            });
            imageUrls.map(async (url) => {
                const { secure_url } = await uploadOnCloudinary(url);
                imageUrls.push(secure_url);
                if (!secure_url) {
                    throw new ApiError(
                        HTTP_INTERNAL_SERVER_ERROR,
                        "Image upload failed"
                    );
                }
            });
        }

        const review = new Review({
            user: userId,
            product: productId,
            rating,
            comment,
        }).session(session);

        const reviewImages = new ReviewImage({
            userId: userId,
            reviewId: review._id,
            imageUrl: imageUrls,
        }).session(session);
        await review.save().session(session);
        await reviewImages.save().session(session);

        const aggregate = await Review.aggregate([
            { $match: { _id: review._id } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
                $lookup: {
                    from: "reviewImages",
                    localField: "_id",
                    foreignField: "reviewId",
                    as: "images",
                },
            },
            { $unwind: "$user" },
            { $unwind: "$images" },
            {
                $project: {
                    _id: 1,
                    rating: 1,
                    comment: 1,
                    "user.name": 1,
                    "user.email": 1,
                    "images.imageUrl": 1,
                },
            },
        ]).session(session);

        await session.commitTransaction();

        return res.status(HTTP_CREATED).json(
            new ApiResponse(HTTP_CREATED, "Review created successfully", {
                aggregate,
            })
        );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});
const getReviews = asyncHandler(async (req, res) => {
    //      Validate the presence of `productId` in the request parameters.
    //     - If missing, throw an error indicating that the product ID is required.
    //   Set the `page` number from the query parameters, defaulting to 1 if not provided.
    //   Set the `pageSize` from the query parameters, defaulting to 10 if not provided.
    //   Calculate the number of documents to skip based on the current page number.

    //   Perform an aggregation query on the `Review` collection:
    //     - Match reviews for the specified `productId`.
    //     - Use `$lookup` to join the `users` collection to get user details (`name`, `email`) for each review.
    //     - Use `$unwind` to deconstruct the user array for each review.
    //     - Use `$lookup` to join the `reviewImages` collection to get the images associated with each review.
    //     - Use `$facet` to:
    //       a. Get the paginated reviews:
    //          - Apply `$skip` to skip the calculated number of documents.
    //          - Apply `$limit` to limit the number of documents to `pageSize`.
    //          - Project only the necessary fields (review details, user details, and images).
    //       b. Count the total number of reviews that match the product ID.

    //   Extract the `reviews` and `total` from the aggregation result.
    //   Calculate the total number of pages based on `total` and `pageSize`.
    //   Return the reviews along with pagination details (total reviews, current page, page size, total pages).
    //   Handle any errors by throwing an appropriate error response.

    const productId = req.params.productId;

    if (!productId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Product ID is required");
    }

    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const skip = (page - 1) * pageSize;

        const reviewsData = await Review.aggregate([
            { $match: { product: productId } }, // Match reviews for the specific product
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "reviewImages",
                    localField: "_id",
                    foreignField: "reviewId",
                    as: "images",
                },
            },
            {
                $facet: {
                    reviews: [
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                rating: 1,
                                comment: 1,
                                "user.name": 1,
                                // "user.email": 1,
                                images: { $ifNull: ["$images", []] }, // Handle empty arrays
                            },
                        },
                    ],
                    total: [{ $count: "total" }],
                },
            },
        ]);

        const reviews = reviewsData[0].reviews;
        const total = reviewsData[0].total[0]?.total || 0;
        const totalPages = Math.ceil(total / pageSize);

        return res.status(HTTP_OK).json(
            new ApiResponse(HTTP_OK, "Reviews retrieved successfully", {
                reviews,
                paginate: {
                    total,
                    page,
                    pageSize,
                    totalPages,
                },
            })
        );
    } catch (error) {
        throw new ApiError(
            error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
        );
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
        const reviewAggregate = await Review.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(reviewId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $lookup: {
                    from: "reviewImages",
                    localField: "_id",
                    foreignField: "reviewId",
                    as: "images",
                },
            },
            {
                $facet: {
                    reviews: [
                        {
                            $project: {
                                _id: 1,
                                rating: 1,
                                comment: 1,
                                "user.name": 1,
                                "user.email": 1,
                                images: { $ifNull: ["$images", []] },
                            },
                        },
                    ],
                },
            },
        ]);

        if (!reviewAggregate || reviewAggregate.length === 0) {
            throw new ApiError(HTTP_NOT_FOUND, "Review not found");
        }

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Review retrieved successfully",
                    reviewAggregate[0].reviews
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

        const reviewImage = await ReviewImage.findOneAndDelete({
            reviewId: reviewId,
            userId: userId,
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
