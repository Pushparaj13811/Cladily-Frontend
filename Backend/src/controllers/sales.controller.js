import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { ProductVarient } from "../models/productVarient.model.js";
import { OrderItem } from "../models/orderItem.model.js";
import { OrderTracking } from "../models/orderTracking.model.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
    HTTP_UNAUTHORIZED,
} from "../httpStatusCode.js";

const getSale = asyncHandler(async (req, res) => {
    // Step 1: Find all variants for the given product ID
    // Step 2: Aggregate sales data for each variant
    // Step 3: Combine sales data with product variants
    // Step 4: Send the response

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(
            HTTP_UNAUTHORIZED,
            "You must be logged in to view sales data"
        );
    }

    const userRole = req.user?.role;
    if (userRole !== "admin") {
        throw new ApiError(HTTP_UNAUTHORIZED, "Unauthorized request.");
    }

    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Product ID is required");
    }

    try {
        const salesData = await OrderItem.aggregate([
            {
                $match: {
                    productVarientId: {
                        $in: [mongoose.Types.ObjectId(productId)],
                    },
                },
            },
            {
                $group: {
                    _id: "$productVarientId",
                    totalQuantitySold: { $sum: "$quantity" },
                    totalSalesAmount: {
                        $sum: { $multiply: ["$quantity", "$price"] },
                    },
                },
            },
        ]);

        const productVariantsData = await ProductVarient.aggregate([
            {
                $match: {
                    productId: mongoose.Types.ObjectId(productId),
                },
            },
            {
                $lookup: {
                    from: "orderitems",
                    localField: "_id",
                    foreignField: "productVarientId",
                    as: "salesData",
                },
            },
            {
                $addFields: {
                    totalQuantitySold: {
                        $sum: {
                            $map: {
                                input: "$salesData",
                                as: "item",
                                in: "$$item.quantity",
                            },
                        },
                    },
                    totalSalesAmount: {
                        $sum: {
                            $map: {
                                input: "$salesData",
                                as: "item",
                                in: {
                                    $multiply: [
                                        "$$item.quantity",
                                        "$$item.price",
                                    ],
                                },
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    size: 1,
                    color: 1,
                    price: 1,
                    stockQuantity: 1,
                    totalQuantitySold: { $ifNull: ["$totalQuantitySold", 0] },
                    totalSalesAmount: { $ifNull: ["$totalSalesAmount", 0] },
                },
            },
        ]);

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Product variants sales data retrieved successfully",
                    productVariantsData
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const getSales = asyncHandler(async (req, res) => {
    // Step 1: Find completed orders from OrderTracking
    // Select only the order IDs
    // Step 2: Aggregate sales data from OrderItem for completed orders
    // Step 3: Fetch all product variants and their products
    // Step 4: Combine sales data with product information
    // Step 5: Remove duplicates and aggregate sales data by productId
    // Step 6: Send the response

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(
            HTTP_UNAUTHORIZED,
            "You must be logged in to view sales data"
        );
    }

    const userRole = req.user?.role;
    if (userRole !== "admin") {
        throw new ApiError(HTTP_UNAUTHORIZED, "Unauthorized request.");
    }

    try {
        const completedOrderTrackings = await OrderTracking.find({
            status: "completed",
        }).select("orderId");

        if (completedOrderTrackings.length === 0) {
            return res
                .status(HTTP_OK)
                .json(
                    new ApiResponse(HTTP_OK, "No completed orders found", [])
                );
        }

        const completedOrderIds = completedOrderTrackings.map(
            (tracking) => tracking.orderId
        );

        const salesData = await OrderItem.aggregate([
            {
                $match: {
                    orderId: { $in: completedOrderIds },
                },
            },
            {
                $group: {
                    _id: "$productVarientId",
                    totalQuantitySold: { $sum: "$quantity" },
                    totalSalesAmount: {
                        $sum: { $multiply: ["$quantity", "$price"] },
                    },
                },
            },
        ]);

        const productVarients = await ProductVarient.find()
            .select("_id productId")
            .populate("productId", "name");

        if (!productVarients.length) {
            throw new ApiError(HTTP_NOT_FOUND, "No product variants found");
        }

        const result = productVarients.map((varient) => {
            const sales =
                salesData.find(
                    (s) => s._id.toString() === varient._id.toString()
                ) || {};
            return {
                productId: varient.productId._id,
                productName: varient.productId.name,
                totalQuantitySold: sales.totalQuantitySold || 0,
                totalSalesAmount: sales.totalSalesAmount || 0,
            };
        });

        const aggregatedResult = result.reduce((acc, curr) => {
            if (!acc[curr.productId]) {
                acc[curr.productId] = {
                    productId: curr.productId,
                    productName: curr.productName,
                    totalQuantitySold: 0,
                    totalSalesAmount: 0,
                };
            }
            acc[curr.productId].totalQuantitySold += curr.totalQuantitySold;
            acc[curr.productId].totalSalesAmount += curr.totalSalesAmount;
            return acc;
        }, {});

        const finalResult = Object.values(aggregatedResult);

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Sales data for all products retrieved successfully",
                    finalResult
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const getSaleBySizeAndColor = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(
            HTTP_UNAUTHORIZED,
            "You must be logged in to view sales data"
        );
    }

    const userRole = req.user?.role;
    if (userRole !== "admin") {
        throw new ApiError(HTTP_UNAUTHORIZED, "Unauthorized request.");
    }

    const { productId, size, color } = req.params;

    if (!productId || !size || !color) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Product ID, size, and color are required"
        );
    }

    try {
        // Find the product variant that matches the given productId, size, and color
        const productVariant = await ProductVarient.findOne({
            productId: mongoose.Types.ObjectId(productId),
            size: size,
            color: color,
        });

        if (!productVariant) {
            throw new ApiError(HTTP_NOT_FOUND, "Product variant not found");
        }

        // Aggregate sales data for the specific product variant
        const salesData = await OrderItem.aggregate([
            {
                $match: {
                    productVarientId: productVariant._id,
                },
            },
            {
                $group: {
                    _id: "$productVarientId",
                    totalQuantitySold: { $sum: "$quantity" },
                    totalSalesAmount: {
                        $sum: { $multiply: ["$quantity", "$price"] },
                    },
                },
            },
        ]);

        const sales = salesData[0] || {};

        const result = {
            variantId: productVariant._id,
            size: productVariant.size,
            color: productVariant.color,
            price: productVariant.price,
            stockQuantity: productVariant.stockQuantity,
            totalQuantitySold: sales.totalQuantitySold || 0,
            totalSalesAmount: sales.totalSalesAmount || 0,
        };

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Product variant sales data retrieved successfully",
                    result
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});



export { getSale, getSales, getSaleBySizeAndColor };
