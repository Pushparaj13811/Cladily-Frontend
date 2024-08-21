import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Guest } from "../models/guest.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateGuestToken } from "../utils/tokenGenerator.js"; // Assuming you have a token generator utility
import {
    HTTP_CREATED,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_OK,
} from "../httpStatusCode.js";

const createGuestSession = asyncHandler(async (req, res) => {
    // Check if the user has an existing guest session
    // If the user has an existing guest session, send the existing session token to the client
    // Generate a new guest session token
    // Create a new guest session and save it to the database
    // Save the generated token
    // Send the new guest session token to the client

    const { ip, headers } = req;
    const userAgent = headers["user-agent"];

    try {
        let guest = await Guest.findOne({ ip, userAgent });

        if (guest) {
            return res
                .status(HTTP_OK)
                .cookie("guestToken", guest.token, {})
                .cookie("guestId", guest._id, {})
                .json(
                    new ApiResponse(HTTP_OK, "Existing session found", {
                        token: guest.token,
                    })
                );
        }

        const token = await generateGuestToken();

        console.log("Token: ", token);
        console.log("IP: ", ip);
        console.log("User Agent: ", userAgent);
        console.log("Headers: ", headers);

        guest = new Guest({
            ip,
            userAgent,
            token,
        });

        await guest.save();

        return res
            .status(HTTP_CREATED)
            .cookie("guestToken", token, {})
            .cookie("guestId", guest._id, {})
            .json(
                new ApiResponse(HTTP_CREATED, "New guest session created", {
                    token,
                })
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

export default createGuestSession;
