import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { supplier } from "../models/supplier.model.js";
import { inventory } from "../models/inventory.model.js";

const createSupplier = asyncHandler(async (req, res) => {});
const getSupplier = asyncHandler(async (req, res) => {});
const getSuppliers = asyncHandler(async (req, res) => {});
const updateSupplier = asyncHandler(async (req, res) => {});
const deleteSupplier = asyncHandler(async (req, res) => {});
export {
    createSupplier,
    getSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier,
};
