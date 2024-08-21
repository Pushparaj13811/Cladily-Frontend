import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Transaction } from "../models/transaction.model.js";
import { ProductVarient } from "../models/productVarient.model.js";
import {
    HTTP_BAD_REQUEST,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_OK,
    HTTP_UNAUTHORIZED,
} from "../httpStatusCode.js";

const createTransaction = asyncHandler(async (req, res) => {});
const getTransaction = asyncHandler(async (req, res) => {});
const getTransactions = asyncHandler(async (req, res) => {});
const updateTransaction = asyncHandler(async (req, res) => {});
const deleteTransaction = asyncHandler(async (req, res) => {});
export {
    createTransaction,
    getTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
};
