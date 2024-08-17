import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/index.js";
import ApiError from "../utils/apiError.js";
import { HTTP_UNAUTHORIZED } from "../httpStatusCode.js";
import jwt from "jsonwebtoken";

const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.authToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(HTTP_UNAUTHORIZED, "Please authenticate");
        }

        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedTokenInfo?._id)
        if (!user) {
            throw new ApiError(HTTP_UNAUTHORIZED, "Invalid token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(HTTP_UNAUTHORIZED, "Please authenticate");
    }
});

export default verifyToken;
