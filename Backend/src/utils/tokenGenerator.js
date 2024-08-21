import crypto from "crypto";
import asyncHandler from "./asyncHandler.js";

const generateGuestToken = asyncHandler(async () => {
    return crypto.randomBytes(32).toString("hex");
});

export { generateGuestToken };
