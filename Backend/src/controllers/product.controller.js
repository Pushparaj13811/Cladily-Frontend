import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { ProductImage } from "../models/productImage.model.js";
import { ProductTag } from "../models/productTag.model.js";
import { ProductVarient } from "../models/productVarient.model.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_FORBIDDEN,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
} from "../httpStatusCode.js";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../services/cloudinary.service.js";

const deleteImages = async (uploadedImageUrls) => {
    const publicIds = uploadedImageUrls.map((url) => {
        return url.split("/").pop().split(".")[0];
    });
    await deleteFromCloudinary(publicIds);
};

const validateProductData = (
    productName,
    categoryId,
    productDescription,
    productImages,
    colors,
    productVarient
) => {
    if (!productName || !categoryId || !productDescription) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Product name, category id, and product description are required"
        );
    }
    if (!productImages || productImages.length === 0) {
        throw new ApiError(HTTP_BAD_REQUEST, "Product images are required");
    }
    if (colors.length !== productImages.length) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Mismatch between images and colors"
        );
    }
    if (!productVarient || productVarient.length === 0) {
        throw new ApiError(HTTP_BAD_REQUEST, "Product variants are required");
    }
};

const uploadProductImages = async (
    productId,
    productImages,
    colors,
    isPrimaryFlag,
    uploadedImageUrls
) => {
    let productImagesData = [];
    for (let i = 0; i < productImages.length; i++) {
        const image = productImages[i];
        const path = image?.path;
        const color = colors[i];
        const { secure_url } = await uploadOnCloudinary(path);

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
            color,
            altText: image.originalname,
            isPrimary: isPrimaryFlag === (i === 0 ? "true" : "false"),
        });
    }
    return productImagesData;
};

const fetchProductDetails = async (productId) => {
    return Product.aggregate([
        { $match: { _id: productId } },
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
                productName: 1,
                categoryId: { categoryName: 1 },
                productDescription: 1,
                productImages: {
                    imageUrl: 1,
                    color: 1,
                    altText: 1,
                    isPrimary: 1,
                },
                productTags: { tagName: 1 },
                productVarient: { size: 1, price: 1, color: 1, quantity: 1 },
            },
        },
    ]);
};

const createProduct = async (req, res) => {
    // Start a MongoDB session and begin a transaction
    // Extract product details and images from request
    // Validate required fields and data consistency
    // - Product name, categoryId, and product description are required
    // - Product images must be provided and should match colors length
    // - Product variants must be provided
    // Find the category by categoryId and validate its existence
    // Create and save a new product with the provided details
    // Upload each product image to Cloudinary and collect image data
    // - Handle errors in image upload and roll back changes if necessary
    // Save product images data to the database
    // Create and save product variants to the database
    // Create and save product tags to the database
    // Commit the transaction and end the session
    // Aggregate product details from the database
    // - Include product images, category, tags, and variants
    // Return a success response with the created product details
    // Abort the transaction and end the session in case of error=
    // Return an error response

    const session = await mongoose.startSession();
    session.startTransaction();
    let uploadedImageUrls = [];

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(HTTP_FORBIDDEN, "Unauthorized request");
    }

    try {
        const {
            productName,
            categoryId,
            productDescription,
            productTag,
            productVarient,
            isPrimary,
            colors,
        } = req.body;

        const productImages = req.files;

        validateProductData(
            productName,
            categoryId,
            productDescription,
            productImages,
            colors,
            productVarient
        );

        const category = await Category.findById(categoryId).session(session);

        if (!category) {
            throw new ApiError(HTTP_BAD_REQUEST, "Category not found");
        }

        const product = new Product({
            productName,
            categoryId,
            productDescription,
            uploadedBy: userId,
        });

        await product.save({ session });

        const productId = product._id;
        const productImagesData = await uploadProductImages(
            productId,
            productImages,
            colors,
            isPrimary,
            uploadedImageUrls
        );

        await ProductImage.insertMany(productImagesData, { session });
        await ProductVarient.insertMany(
            productVarient.map((v) => ({ productId, ...v })),
            { session }
        );
        await ProductTag.insertMany(
            productTag.map((tag) => ({ productId, tag })),
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        // get product details using aggregate

        const productDetails = await fetchProductDetails(productId);

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_CREATED,
                    "Product created successfully",
                    productDetails
                )
            );
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (uploadedImageUrls.length > 0) {
            await deleteImages(uploadedImageUrls);
        }

        return res
            .status(error.statusCode || HTTP_INTERNAL_SERVER_ERROR)
            .json(new ApiResponse(error.statusCode, error.message));
    }
};

const updateProduct = async (req, res) => {
    // Start a MongoDB session and begin a transaction
    // Extract product details and images from request
    // Validate required fields and data consistency
    // - Product name, categoryId, and product description are required
    // Find the category by categoryId and validate its existence
    // Find the product by productId and validate its existence
    // Update the product with the provided details
    // - if Product variants is provided
    // find the product variants by productId and update them with the provided details
    // - if Product tags is provided
    // find the product tags by productId and update them with the provided details

    const session = await mongoose.startSession();
    session.startTransaction();

    const productId = req.params?.id;

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

    try {
        const category = await Category.findById(categoryId).session(session);
        if (!category) {
            throw new ApiError(HTTP_BAD_REQUEST, "Category not found");
        }

        const updateProductFields = {};

        if (productName) updateProductFields.name = productName;
        if (productDescription)
            updateProductFields.description = productDescription;

        const product = await Product.findOneAndUpdate(
            {
                _id: productId,
                uploadedBy: userId,
            },
            updateProductFields,
            {
                new: true,
            }
        ).session(session);

        if (!product) {
            throw new ApiError(HTTP_BAD_REQUEST, "Product not found");
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
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return res
            .status(HTTP_BAD_REQUEST)
            .json(new ApiResponse(HTTP_BAD_REQUEST, "Category not found"));
    }
};

const deleteProduct = async (req, res) => {
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

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(HTTP_NOT_FOUND, "Product not found");
    }

    if (product.uploadedBy.toString() !== userId) {
        throw new ApiError(HTTP_FORBIDDEN, "Unauthorized request");
    }

    try {
        const productImages = await ProductImage.find({ productId });

        if (productImages.length > 0) {
            await deleteImages(productImages.map((image) => image.imageUrl));
            await ProductImage.deleteMany({ productId });
        }

        await ProductVarient.deleteMany({ productId });

        await ProductTag.deleteMany({ productId });

        await Product.findByIdAndDelete(productId);

        return res
            .status(HTTP_OK)
            .json(new ApiResponse(HTTP_OK, "Product deleted successfully"));
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

const fetchAllProducts = async (req, res) => {
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

        if (products.length === 0) {
            throw new ApiError(HTTP_NOT_FOUND, "No products found");
        }

        const productDetails = await fetchProductDetails(
            products.map((p) => p._id)
        );

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Products fetched successfully",
                    productDetails
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

const fetchProductById = async (req, res) => {
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

        const productDetails = await fetchProductDetails(productId);

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
};

export {
    createProduct,
    updateProduct,
    deleteProduct,
    fetchAllProducts,
    fetchProductById,
};
