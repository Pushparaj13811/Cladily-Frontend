import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ShoppingCart } from "../models/shoppingCart.model.js";
import { CartItem } from "../models/cartItem.model.js";
import {
    HTTP_CREATED,
    HTTP_OK,
    HTTP_BAD_GATEWAY,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_FORBIDDEN,
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

    const cart = await ShoppingCart.aggregate([
        {
            $match: {
                $or: [{ userId: userId }, { guestId: guestId }],
            },
        },
        {
            $lookup: {
                from: "cartitems",
                localField: "_id",
                foreignField: "cartId",
                as: "items",
            },
        },
        {
            $lookup: {
                from: "productvarients",
                localField: "items.productVarientId",
                foreignField: "_id",
                as: "products",
            },
        },
        {
            $unwind: { path: "$items", preserveNullAndEmptyArrays: true },
        },
        {
            $unwind: { path: "$products", preserveNullAndEmptyArrays: true },
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                guestId: 1,
                items: {
                    quantity: 1,
                    productVarientId: 1,
                },
                products: {
                    _id: 1,
                    productId: 1,
                    size: 1,
                    color: 1,
                    price: 1,
                },
            },
        },
    ]);

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

    return res
        .status(HTTP_OK)
        .json(new ApiResponse(HTTP_OK, "Cart retrieved successfully", cart[0]));
});

const addToCart = asyncHandler(async (req, res) => {
    // 1. Check if the user ID or guest ID is available from the request.
    // 2. Check if the product ID and quantity are available in the request body.
    // 3. Find or create the cart and update or add the cart item
    // 4. Update existing item or create a new one
    // 5. Aggregate cart details with items and products

    const userId = req.user?._id;
    const guestId = req.cookies.guestId;

    if (!userId && !guestId) {
        throw new ApiError(400, "User or guest ID not found");
    }

    const { productVarientId, quantity } = req.body;

    if (!productVarientId || !quantity) {
        throw new ApiError(400, "Product ID and quantity are required");
    }

    try {
        // Find or create the cart
        const cart = await ShoppingCart.findOneAndUpdate(
            { $or: [{ userId }, { guestId }] },
            { $setOnInsert: { userId, guestId } },
            { new: true, upsert: true }
        );

        // Find the existing cart item
        const existingItem = await CartItem.findOne({
            cartId: cart._id,
            productVarientId,
        });

        if (existingItem) {
            if (existingItem.quantity + parseInt(quantity) <= 5) {
                existingItem.quantity += parseInt(quantity);
                await existingItem.save();
            } else {
                throw new ApiError(HTTP_FORBIDDEN, "Quantity limit exceeded");
            }
        } else {
            // Create new cart item
            await CartItem.create({
                cartId: cart._id,
                productVarientId,
                quantity,
            });
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

            { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "productvarients",
                    localField: "items.productVarientId",
                    foreignField: "_id",
                    as: "products",
                },
            },

            {
                $unwind: {
                    path: "$products",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $project: {
                    _id: 1,
                    guestId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    products: {
                        _id: 1,
                        name: 1,
                        size: 1,
                        color: 1,
                        price: 1,
                        StockQuantity: 1,
                    },
                },
            },
        ]);

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Item added to cart successfully",
                    cartDetails
                )
            );
    } catch (error) {
        throw new ApiError(
            error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
        );
    }
});

const updateCart = asyncHandler(async (req, res) => {
    // 1. Check if the user ID or guest ID is available from the request.
    // 2. Check if the product ID and quantity are available in the request body.
    // 3. Find the cart based on the user ID or guest ID.
    // 4. Find the cart item based on the product ID and cart ID.
    // 5. Update the quantity of the cart item.
    // 6. Return the updated cart details.
    // 7. Handle any errors that occur during the process.

    const userId = req.user?._id;
    const guestId = req.cookies?.guestId;

    if (!userId && !guestId) {
        throw new ApiError(HTTP_BAD_GATEWAY, "User or guest ID not found");
    }

    const { productVarientId, quantity } = req.body;

    if (!productVarientId || !quantity) {
        throw new ApiError(
            HTTP_BAD_GATEWAY,
            "Product ID and quantity are required"
        );
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

        if (quantity <= 0) {
            await cartItem.remove();
            return res
                .status(HTTP_OK)
                .json(new ApiResponse(HTTP_OK, "Product removed from cart"));
        }

        if (quantity > 5 || cartItem.quantity + quantity > 5) {
            throw new ApiError(HTTP_BAD_GATEWAY, "Quantity limit exceeded");
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        const cartDetails = await ShoppingCart.aggregate([
            { $match: { _id: cart._id } },
            {
                $lookup: {
                    from: "cartItems",
                    localField: "_id",
                    foreignField: "cartId",
                    as: "items",
                },
            },
            {
                $lookup: {
                    from: "productVarients",
                    localField: "items.productVarientId",
                    foreignField: "_id",
                    as: "products",
                },
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    guestId: 1,
                    items: 1,
                    products: {
                        _id: 1,
                        name: 1,
                        size: 1,
                        color: 1,
                        price: 1,
                    },
                },
            },
        ]);

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Cart updated successfully",
                    cartDetails
                )
            );
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

        await cartItem.remove();

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
