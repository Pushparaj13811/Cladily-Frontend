import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Discount } from "../models/index.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_CREATED,
    HTTP_UNAUTHORIZED,
} from "../httpStatusCode.js";

const discountValidation = async () => {
    return { success: true, message: "Discount is valid" };
};
