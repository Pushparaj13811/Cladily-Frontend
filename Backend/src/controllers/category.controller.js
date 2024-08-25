import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
} from "../httpStatusCode.js";

const createCategory = asyncHandler(async (req, res) => {
    // Get the category name and description from the request body
    // Check if the category name and description are provided
    // Check if the category name is unique
    // Create the category
    // Return the created category
    // Handle any errors

    const { name, description } = req.body;
    const user = req.user;

    if (user.role !== "admin") {
        throw new ApiError(HTTP_BAD_REQUEST, "Unauthorized request");
    }

    if (!name || (!name.trim() && !description) || !description.trim()) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Category name and description are required"
        );
    }

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        throw new ApiError(HTTP_BAD_REQUEST, "Category already exists");
    }

    const category = new Category({
        categoryName: name,
        description,
    });

    try {
        const savedCategory = await category.save();
        return res
            .status(HTTP_OK)
            .json(new ApiResponse(HTTP_OK, "Category created", savedCategory));
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});
const deleteCategory = asyncHandler(async (req, res) => {
    // Get the category id from the request params
    // Check if the category exists
    // Delete the category
    // Return a success message
    // Handle any errors

    const { categoryId } = req.params;
    const user = req.user;

    try {
        if (user.role !== "admin") {
            throw new ApiError(HTTP_BAD_REQUEST, "Unauthorized request");
        }

        const category = await Category.findByIdAndDelete(categoryId);

        if (!category) {
            throw new ApiError(HTTP_NOT_FOUND, "Category not found");
        }

        return res
            .status(HTTP_OK)
            .json(new ApiResponse(HTTP_OK, "Category deleted"));
    } catch (error) {
        throw new ApiError(
            error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
        );
    }
});
const getCategories = asyncHandler(async (req, res) => {
    // Get all categories
    // Return the categories
    // Handle any errors

    try {
        const categories = await Category.find();
        return res
            .status(HTTP_OK)
            .json(new ApiResponse(HTTP_OK, "Categories", categories));
    } catch (error) {
        throw new ApiError(
            error.statusCode || HTTP_INTERNAL_SERVER_ERROR,
            error.message || "Internal server error"
        );
    }
});

export { createCategory, deleteCategory, getCategories };
