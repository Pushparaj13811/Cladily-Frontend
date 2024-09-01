import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ShoppingCart } from "../models/shoppingCart.model.js";
import { CartItem } from "../models/cartItem.model.js";
import { ProductVarient } from "../models/productVarient.model.js";
import {
    HTTP_CREATED,
    HTTP_OK,
    HTTP_BAD_GATEWAY,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_BAD_REQUEST,
    HTTP_NOT_FOUND,
} from "../httpStatusCode.js";

const getCart = asyncHandler(async (req, res) => {
    // 1. Check if the user ID or guest ID is available from the request.
    // 2. If neither is available, throw an error indicating that the user or guest ID is required.

    // 3. Perform a single database query using the aggregation pipeline:
    //    a. Use $match to find the shopping cart based on the user ID or guest ID.
    //    b. Use $lookup to join the cart with the cart items collection, fetching all items related to the cart.
    //    c. Use $lookup again to join the cart items with the products collection, fetching product details for each item in the cart.
    //    d. Use $project to select only the necessary fields from the cart, items, and products.

    // 4. Check if the cart is empty or not found:
    //    a. If the cart doesn't exist, create a new cart for the guest ID.
    //    b. Save the new cart and return it in the response.

    // 5. If the cart is found, return the cart details, including the items and associated product information, in the response.

    const userId = req.user?._id;
    const guestId = req.cookies.guestId;

    if (!userId && !guestId) {
        throw new ApiError(400, "User or guest ID not found");
    }

    const cart = await ShoppingCart.findOne({
        $or: [{ userId }, { guestId }],
    });

    if (!cart || cart.length === 0) {
        const newCart = new ShoppingCart({
            guestId: guestId,
        });
        await newCart.save();
        return res
            .status(HTTP_CREATED)
            .json(
                new ApiResponse(
                    HTTP_CREATED,
                    "Cart created successfully",
                    newCart
                )
            );
    }

    const cartDetails = await ShoppingCart.aggregate([
        { $match: { _id: cart._id } },
        {
            $lookup: {
                from: "cartitems",
                localField: "_id",
                foreignField: "cartId",
                as: "items",
            },
        },
        {
            $unwind: { path: "$items", preserveNullAndEmptyArrays: true },
        },
        {
            $lookup: {
                from: "productvarients",
                localField: "items.productVarientId",
                foreignField: "_id",
                as: "productsDetails",
            },
        },
        {
            $unwind: {
                path: "$productsDetails",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "products",
                localField: "productsDetails.productId",
                foreignField: "_id",
                as: "product",
            },
        },
        {
            $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "productimages",
                let: {
                    productId: "$product._id",
                    itemColor: "$productsDetails.color",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$productId", "$$productId"] },
                                    { $eq: ["$color", "$$itemColor"] },
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            imageUrl: 1,
                            color: 1,
                            _id: 0,
                        },
                    },
                ],
                as: "product.images",
            },
        },
        {
            $addFields: {
                "items.totalPrice": {
                    $multiply: ["$productsDetails.mrp", "$items.quantity"],
                },
                "items.imageUrl": {
                    $arrayElemAt: ["$product.images.imageUrl", 0],
                },
                "items.imageColor": {
                    $arrayElemAt: ["$product.images.color", 0],
                },
                "items.productVarientId": "$productsDetails._id",
                "items.name": "$product.name",
                "items.size": "$productsDetails.size",
                "items.color": "$productsDetails.color",
                "items.mrp": "$productsDetails.mrp",
            },
        },
        {
            $group: {
                _id: "$_id",
                cartId: { $first: "$_id" },
                userId: { $first: "$userId" },
                guestId: { $first: "$guestId" },
                items: {
                    $push: {
                        productVarientId: "$items.productVarientId",
                        name: "$items.name",
                        size: "$items.size",
                        color: "$items.color",
                        quantity: "$items.quantity",
                        totalPrice: "$items.totalPrice",
                        mrp: "$items.mrp",
                        imageUrl: "$items.imageUrl",
                        imageColor: "$items.imageColor",
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                cartId: 1,
                userId: 1,
                guestId: 1,
                items: 1,
            },
        },
    ]);

    return res
        .status(HTTP_OK)
        .json(
            new ApiResponse(HTTP_OK, "Cart retrieved successfully", cartDetails)
        );
});

const addToCart = asyncHandler(async (req, res) => {
    // Check product variant availability
    // Find or create the cart and update the item
    // Update or create the cart item
    // Respond with a success message and product variant ID

    const userId = req.user?._id;
    const guestId = req.cookies.guestId;

    if (!userId && !guestId) {
        throw new ApiError(HTTP_BAD_REQUEST, "User or guest ID not found");
    }

    const { productVarientId, quantity } = req.body;

    if (!productVarientId || !quantity) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Product ID and quantity are required"
        );
    }

    const quantityInt = parseInt(quantity);

    try {
        const productVarient = await ProductVarient.findById(productVarientId);
        if (!productVarient) {
            throw new ApiError(HTTP_BAD_GATEWAY, "Product not found");
        }
        if (productVarient.StockQuantity < quantityInt) {
            throw new ApiError(
                HTTP_BAD_GATEWAY,
                "Sorry, we don't have enough stock"
            );
        }

        const cart = await ShoppingCart.findOneAndUpdate(
            { $or: [{ userId }, { guestId }] },
            { $setOnInsert: { userId, guestId } },
            { new: true, upsert: true }
        );

        await CartItem.findOneAndUpdate(
            { cartId: cart._id, productVarientId },
            { $inc: { quantity: quantityInt } },
            { upsert: true, new: true }
        );

        return res.status(HTTP_OK).json({
            statusCode: HTTP_OK,
            message: "Item successfully added to cart",
            productVarientId,
        });
    } catch (error) {
        throw new ApiError(
            error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
        );
    }
});

const updateCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const guestId = req.cookies?.guestId;

    if (!userId && !guestId) {
        throw new ApiError(HTTP_BAD_REQUEST, "User or guest ID not found");
    }

    const { productVarientId, quantity } = req.body;

    if (!productVarientId || quantity === undefined) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Product ID and quantity are required"
        );
    }

    try {
        const quantityInt = parseInt(quantity);
        if (isNaN(quantityInt)) {
            throw new ApiError(HTTP_BAD_REQUEST, "Quantity must be a number");
        }

        const cart = await ShoppingCart.findOne({
            $or: [{ userId }, { guestId }],
        });

        if (!cart) {
            throw new ApiError(HTTP_NOT_FOUND, "Cart not found");
        }

        const cartItem = await CartItem.findOne({
            cartId: cart._id,
            productVarientId,
        });

        if (!cartItem) {
            throw new ApiError(HTTP_NOT_FOUND, "Product not found in cart");
        }

        // Handle removal
        if (quantityInt <= 0) {
            if (cartItem.quantity === 1 && quantityInt === -1) {
                await CartItem.deleteOne({
                    cartId: cart._id,
                    productVarientId,
                });
                return res
                    .status(HTTP_OK)
                    .json(
                        new ApiResponse(HTTP_OK, "Product removed from cart")
                    );
            } else if (quantityInt < 0 && cartItem.quantity > -quantityInt) {
                cartItem.quantity += quantityInt;
                if (cartItem.quantity <= 0) {
                    await CartItem.deleteOne({
                        cartId: cart._id,
                        productVarientId,
                    });
                    return res
                        .status(HTTP_OK)
                        .json(
                            new ApiResponse(
                                HTTP_OK,
                                "Product removed from cart"
                            )
                        );
                }
                await cartItem.save();
            }
        } else {
            // Handle addition
            if (cartItem.quantity + quantityInt > 5) {
                throw new ApiError(HTTP_BAD_REQUEST, "Quantity limit exceeded");
            }
            cartItem.quantity += quantityInt;
            await cartItem.save();
        }

        return res
            .status(HTTP_OK)
            .json(new ApiResponse(HTTP_OK, "Cart updated", productVarientId));
    } catch (error) {
        throw new ApiError(
            error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
        );
    }
});

const removeFromCart = asyncHandler(async (req, res) => {
    // 1. Check if the user ID or guest ID is available from the request.
    // 2. Check if the product ID is available in the request body.
    // 3. Find the cart based on the user ID or guest ID.
    // 4. Find the cart item based on the product ID and cart ID.
    // 5. Delete the cart item.
    // 6. Return a success response.
    // 7. Handle any errors that occur during the process.

    const userId = req.user?._id;
    const guestId = req.cookies?.guestId;

    if (!userId && !guestId) {
        throw new ApiError(HTTP_BAD_GATEWAY, "User or guest ID not found");
    }

    const { productVarientId } = req.body;

    if (!productVarientId) {
        throw new ApiError(HTTP_BAD_GATEWAY, "Product ID is required");
    }

    try {
        const cart = await ShoppingCart.findOne({
            $or: [{ userId }, { guestId }],
        });

        if (!cart) {
            throw new ApiError(HTTP_BAD_GATEWAY, "Cart not found");
        }

        const cartItem = await CartItem.findOne({
            cartId: cart._id,
            productVarientId,
        });

        if (!cartItem) {
            throw new ApiError(HTTP_BAD_GATEWAY, "Product not found in cart");
        }

        await cartItem.deleteOne({ _id: cartItem._id });

        return res
            .status(HTTP_OK)
            .json(new ApiResponse(HTTP_OK, "Product removed from cart"));
    } catch (error) {
        throw new ApiError(
            error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
        );
    }
});

const clearCart = asyncHandler(async (req, res) => {
    // 1. Check if the user ID or guest ID is available from the request.
    // 2. Find the cart based on the user ID or guest ID.
    // 3. Delete all cart items associated with the cart.
    // 4. Return a success response.
    // 5. Handle any errors that occur during the process.

    const userId = req.user?._id;
    const guestId = req.cookies?.guestId;

    if (!userId && !guestId) {
        throw new ApiError(HTTP_BAD_GATEWAY, "User or guest ID not found");
    }

    try {
        const cart = await ShoppingCart.findOne({
            $or: [{ userId }, { guestId }],
        });

        if (!cart) {
            throw new ApiError(HTTP_BAD_GATEWAY, "Cart not found");
        }

        await CartItem.deleteMany({ cartId: cart._id });

        return res
            .status(HTTP_OK)
            .json(new ApiResponse(HTTP_OK, "Cart cleared successfully"));
    } catch (error) {
        throw new ApiError(
            error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
        );
    }
});

export { getCart, addToCart, updateCart, removeFromCart, clearCart };
