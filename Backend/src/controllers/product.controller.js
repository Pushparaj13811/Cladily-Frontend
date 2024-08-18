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
    HTTP_INTERNAL_SERVER_ERROR,
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
    if (!productId) {
        throw new ApiError(HTTP_BAD_REQUEST, "Product id is required");
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

        const product = await Product.findByIdAndUpdate(
            productId,
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

const deleteProduct = async (req, res) => {};

const fetchAllProducts = async (req, res) => {};

const fetchProductById = async (req, res) => {};



export {
    createProduct,
    updateProduct,
    deleteProduct,
    fetchAllProducts,
    fetchProductById,
};
