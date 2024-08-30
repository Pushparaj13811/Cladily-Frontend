import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import redisClient from "../utils/redisClient.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { ProductImage } from "../models/productImage.model.js";
import { ProductTag } from "../models/productTag.model.js";
import { ProductVarient } from "../models/productVarient.model.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_FORBIDDEN,
    HTTP_OK,
} from "../httpStatusCode.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../services/cloudinary.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const deleteImages = async (uploadedImageUrl) => {
    const publicId = uploadedImageUrl
        .split("/")
        .slice(-2)
        .map((segment) => segment.split(".").shift())
        .join("/");
    await deleteFromCloudinary(publicId);
};

const validateProductData = async (
    categoryId,
    productName,
    productDescription,
    GarmentType,
    specification
) => {
    if (!productName || !categoryId || !productDescription) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Product name, category id, and product description are required"
        );
    }

    if (!GarmentType || !specification) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Garment type and specification are required"
        );
    }
};

const validateProductVarientData = async (productVarient) => {
    if (!productVarient || productVarient.length === 0) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Product variant details are required."
        );
    }

    for (let i = 0; i < productVarient.length; i++) {
        const { size, fit, color, mrp, stockQuantity } = productVarient[i];

        if (!size) {
            throw new ApiError(
                HTTP_BAD_REQUEST,
                `Size is required for variant at index ${i}.`
            );
        }

        if (!fit) {
            throw new ApiError(
                HTTP_BAD_REQUEST,
                `Fit is required for variant at index ${i}.`
            );
        }

        if (!color) {
            throw new ApiError(
                HTTP_BAD_REQUEST,
                `Color is required for variant at index ${i}.`
            );
        }

        if (typeof mrp !== "number" || mrp <= 0) {
            throw new ApiError(
                HTTP_BAD_REQUEST,
                `MRP should be a positive number for variant at index ${i}.`
            );
        }

        if (typeof stockQuantity !== "number" || stockQuantity < 0) {
            throw new ApiError(
                HTTP_BAD_REQUEST,
                `Stock Quantity should be a non-negative number for variant at index ${i}.`
            );
        }
    }
};

const uploadProductImages = async (
    productId,
    productImages,
    colors,
    isPrimaryFlag
) => {
    let uploadedImageUrls = [];
    let productImagesData = [];

    if (colors.length !== productImages.length) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Number of colors does not match the number of image sets"
        );
    }

    for (let i = 0; i < colors.length; i++) {
        const imageFiles = productImages[i];

        for (let j = 0; j < imageFiles.length; j++) {
            const localFilePath = imageFiles[j].path;

            try {
                const { secure_url } = await uploadOnCloudinary(localFilePath);

                if (!secure_url) {
                    throw new ApiError(
                        HTTP_INTERNAL_SERVER_ERROR,
                        "Product images not uploaded successfully"
                    );
                }

                uploadedImageUrls.push(secure_url);

                productImagesData.push({
                    productId,
                    imageUrl: secure_url,
                    color: colors[i],
                    altText: imageFiles[j].originalname,
                    isPrimary: isPrimaryFlag[i] === true && j === 0,
                });
            } catch (error) {
                throw new ApiError(
                    error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
                    error.message || "Error uploading image"
                );
            }
        }
    }

    return { productImagesData, uploadedImageUrls };
};

const fetchProductDetails = async (productId) => {
    const productDetails = Product.aggregate([
        { $match: { _id: productId } },
        {
            $lookup: {
                from: "users",
                localField: "uploadedBy",
                foreignField: "_id",
                as: "uploadedBy",
            },
        },
        {
            $lookup: {
                from: "productimages",
                localField: "_id",
                foreignField: "productId",
                as: "productImages",
            },
        },
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category",
            },
        },
        {
            $lookup: {
                from: "producttags",
                localField: "_id",
                foreignField: "productId",
                as: "productTags",
            },
        },
        {
            $lookup: {
                from: "productvarients",
                localField: "_id",
                foreignField: "productId",
                as: "productVarient",
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                uploadedBy: {
                    _id: 1,
                    username: 1,
                    firstName: 1,
                    lastName: 1,
                },
                category: { categoryName: 1 },
                description: 1,
                productImages: {
                    imageUrl: 1,
                    color: 1,
                    altText: 1,
                    isPrimary: 1,
                },
                productTags: { tagName: 1 },
                productVarient: {
                    _id: 1,
                    size: 1,
                    fit: 1,
                    mrp: 1,
                    color: 1,
                    stockQuantity: 1,
                },
            },
        },
    ]);

    return productDetails;
};
const fetchAllProductDetails = async () => {
    const products = Product.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "uploadedBy",
                foreignField: "_id",
                as: "uploadedBy",
            },
        },
        {
            $lookup: {
                from: "productimages",
                localField: "_id",
                foreignField: "productId",
                as: "productImages",
            },
        },
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category",
            },
        },
        {
            $lookup: {
                from: "producttags",
                localField: "_id",
                foreignField: "productId",
                as: "productTags",
            },
        },
        {
            $lookup: {
                from: "productvarients",
                localField: "_id",
                foreignField: "productId",
                as: "productVarient",
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                uploadedBy: {
                    _id: 1,
                    username: 1,
                    firstName: 1,
                    lastName: 1,
                },
                category: { categoryName: 1 },
                description: 1,
                productImages: {
                    imageUrl: 1,
                    color: 1,
                    altText: 1,
                    isPrimary: 1,
                },
                productTags: { tagName: 1 },
                productVarient: {
                    _id: 1,
                    size: 1,
                    fit: 1,
                    mrp: 1,
                    color: 1,
                    stockQuantity: 1,
                },
            },
        },
    ]);

    return products;
};

const createProduct = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user || user.role !== "admin") {
        throw new ApiError(HTTP_FORBIDDEN, "Unauthorized request");
    }

    const {
        categoryId,
        productName,
        description,
        garmentType,
        care,
        specification,
        productTags,
        productVarient,
        colors,
        isPrimary,
    } = req.body;

    await validateProductData(
        categoryId,
        productName,
        description,
        garmentType,
        specification
    );

    const categoryExists = await Category.exists({ _id: categoryId });
    if (!categoryExists) {
        throw new ApiError(HTTP_BAD_REQUEST, "Invalid category ID");
    }

    const productImages = req.files?.productImages;

    const product = new Product({
        categoryId,
        name: productName,
        description,
        uploadedBy: user._id,
        garmentType,
        care,
        specification,
    });

    const newProduct = await product.save();
    const productId = newProduct._id;
    let alreadyUploadedImages;

    try {
        const { productImagesData, uploadedImageUrls } =
            await uploadProductImages(
                productId,
                productImages,
                colors,
                isPrimary
            );

        alreadyUploadedImages = uploadedImageUrls;
        await validateProductVarientData(productVarient);

        // Insert related product data in parallel
        await Promise.all([
            ProductImage.insertMany(productImagesData),
            ProductTag.insertMany(
                productTags.map((tag) => ({ productId, tag }))
            ),
            ProductVarient.insertMany(
                productVarient.map((v) => ({ productId, ...v }))
            ),
        ]);

        const response = await fetchProductDetails(productId);

        return res
            .status(HTTP_CREATED)
            .json(
                new ApiResponse(
                    HTTP_CREATED,
                    "Product created successfully",
                    response
                )
            );
    } catch (error) {
        await Product.findByIdAndDelete(productId);
        if (alreadyUploadedImages) {
            for (let i = 0; i < alreadyUploadedImages.length; i++) {
                await deleteImages(alreadyUploadedImages[i]);
            }
        }
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productId = new mongoose.Types.ObjectId(req.params?.id);
        const userId = req.user?._id;

        if (!productId) {
            throw new ApiError(HTTP_BAD_REQUEST, "Product id is required");
        }

        if (!userId) {
            throw new ApiError(HTTP_FORBIDDEN, "Unauthorized request");
        }

        const {
            productName,
            categoryId,
            productDescription,
            productTags,
            productVarient,
        } = req.body;

        const product = await Product.findOne({
            _id: productId,
            uploadedBy: userId,
        }).session(session);
        if (!product) {
            throw new ApiError(HTTP_BAD_REQUEST, "Product not found");
        }

        // Update product details if provided
        const updateProductFields = {};
        if (productName) updateProductFields.name = productName;
        if (productDescription)
            updateProductFields.description = productDescription;
        if (categoryId) {
            const categoryExists = await Category.exists({
                _id: categoryId,
            }).session(session);
            if (!categoryExists) {
                throw new ApiError(HTTP_BAD_REQUEST, "Invalid category ID");
            }
            updateProductFields.categoryId = categoryId;
        }

        if (Object.keys(updateProductFields).length > 0) {
            await Product.updateOne(
                { _id: productId },
                { $set: updateProductFields }
            ).session(session);
        }

        // Update product variants if provided
        if (productVarient && productVarient.length > 0) {
            await ProductVarient.deleteMany({ productId }).session(session);
            await ProductVarient.insertMany(
                productVarient.map((v) => ({ productId, ...v })),
                { session }
            );
        }

        // Update product tags if provided
        if (productTags && productTags.length > 0) {
            await ProductTag.deleteMany({ productId }).session(session);
            await ProductTag.insertMany(
                productTags.map((tag) => ({ productId, tag })),
                { session }
            );
        }

        // Commit the transaction
        await session.commitTransaction();

        // Clear product details from cache
        const cacheKey = `product:${productId}`;
        await redisClient.del(cacheKey);

        // Fetch updated product details
        const response = await fetchProductDetails(productId);

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Product updated successfully",
                    response
                )
            );
    } catch (error) {
        await session.abortTransaction();
        return res
            .status(HTTP_BAD_REQUEST)
            .json(new ApiResponse(HTTP_BAD_REQUEST, error.message));
    } finally {
        session.endSession();
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    // Get the productId from the request
    // Find the product by productId
    // - If the product is not found, return an error response
    // - If the uploadedBy field of the product does not match the userId, return an error response
    // Find the product images by productId
    // - If images are found, delete them from Cloudinary
    // Delete the product images from the database
    // Find the product variants by productId
    // Delete the product variants from the database
    // Find the product tags by productId
    // Delete the product tags from the database
    // Delete the product from the database
    // Return a success response

    const productId = req.params?.id;
    const userId = req.user?._id;

    if (!productId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Product id is required");
    }

    if (!userId) {
        throw new ApiError(HTTP_FORBIDDEN, "Unauthorized request");
    }

    const id = new mongoose.Types.ObjectId(productId);

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(HTTP_NOT_FOUND, "Product not found");
    }

    if (product.uploadedBy.toString() !== userId.toString()) {
        throw new ApiError(HTTP_FORBIDDEN, "Unauthorized request");
    }

    try {
        const productImages = await ProductImage.find({ productId });

        if (productImages.length > 0) {
            for (let i = 0; i < productImages.length; i++) {
                console.log(productImages[i].imageUrl);
                await deleteImages(productImages[i].imageUrl);
            }
        }
        await ProductImage.deleteMany({ productId });

        await ProductVarient.deleteMany({ productId });

        await ProductTag.deleteMany({ productId });

        await Product.findByIdAndDelete(productId);

        // Delete product details from cache
        const cacheKey = "products";
        await redisClient.del(cacheKey);

        return res
            .status(HTTP_OK)
            .json(new ApiResponse(HTTP_OK, "Product deleted successfully"));
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
    // Get page and limit from the query parameters
    // Find all products with pagination
    // - If no products are found, return an error response
    // Aggregate product details from the database
    // - Include product images, category, tags, and variants
    // Return a success response with the product details
    // Return an error response in case of error

    const page = parseInt(req.query?.page) || 1;
    const limit = parseInt(req.query?.limit) || 10;

    try {
        const products = await Product.find()
            .skip(limit * (page - 1))
            .limit(limit);

        let message = "Products fetched successfully";

        if (products.length === 0) {
            message = "There are no products available";
        }

        const cacheKey = "products";
        const cachedProducts = await redisClient.get(cacheKey);
        let productDetails;

        if (cachedProducts) {
            productDetails = JSON.parse(cachedProducts);
        } else {
            productDetails = await fetchAllProductDetails();
            await redisClient.set(
                cacheKey,
                JSON.stringify(productDetails),
                "EX",
                5
            );
        }

        return res
            .status(HTTP_OK)
            .json(new ApiResponse(HTTP_OK, message, productDetails));
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const fetchProductById = asyncHandler(async (req, res) => {
    // Get the productId from the request
    // Find the product by productId
    // - If the product is not found, return an error response
    // pass the product id to fetchProductDetails function
    // Return a success response with the product details

    const productId = req.params?.id;

    if (!productId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Product id is required");
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            throw new ApiError(HTTP_NOT_FOUND, "Product not found");
        }
        const cacheKey = `product:${productId}`;
        const cachedProduct = await redisClient.get(cacheKey);
        let productDetails;

        if (cachedProduct) {
            productDetails = JSON.parse(cachedProduct);
        } else {
            productDetails = await fetchProductDetails(product._id);
            redisClient.setEx(cacheKey, 3600, JSON.stringify(productDetails));
        }

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Product details fetched successfully",
                    productDetails
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

export {
    createProduct,
    updateProduct,
    deleteProduct,
    fetchAllProducts,
    fetchProductById,
};
