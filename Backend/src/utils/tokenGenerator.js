import crypto from "crypto";
import asyncHandler from "./asyncHandler";

const generateGuestToken = asyncHandler(async () => {
    return crypto.randomBytes(32).toString("hex");
});

export { generateGuestToken };
