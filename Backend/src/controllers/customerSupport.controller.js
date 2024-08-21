import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { CustomerSupport } from "../models/customerSupport.model.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
} from "../httpStatusCode.js";

const createCustomerSupportTicket = async (req, res, next) => {
    // Get the user id and message from the request body
    // Check if the user id and message are provided
    // Create the customer support ticket
    // Return the created customer support ticket
    // Handle any errors

    const { userId, message } = req.body;

    if (!userId || !message) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "User id and message are required"
        );
    }

    const customerSupport = new CustomerSupport({
        userId,
        message,
    });

    try {
        const savedCustomerSupport = await customerSupport.save();
        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Customer support ticket created",
                    savedCustomerSupport
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};
const getCustomerSupportTickets = async (req, res, next) => {
    // Get all customer support tickets
    // Return the customer support tickets
    // Handle any errors
    // const customerSupportTickets = await CustomerSupport.find();
    // return res
};
const updateCustomerSupportTicket = async (req, res, next) => {};
const deleteCustomerSupportTicket = async (req, res, next) => {};
