import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import {
    HTTP_UNAUTHORIZED,
    HTTP_OK,
    HTTP_CREATED,
    HTTP_BAD_REQUEST,
    HTTP_FORBIDDEN,
    HTTP_NOT_FOUND,
    HTTP_INTERNAL_SERVER_ERROR,
} from "../httpStatusCode.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Address } from "../models/address.model.js";
import sendVerificationEmail from "../services/sendVerificationEmail.service.js";
import sendWelcomeEmail from "../services/sendWelcomeEmail.services.js";
import sendResetPasswordEmail from "../services/sendResetPasswordEmail.service.js";

const userNameGenerator = (firstName, lastName) => {
    const random = Math.floor(Math.random() * 1000);
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${random}`;
    return username.toLowerCase();
};

const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
};

const registerUser = asyncHandler(async (req, res) => {
    // Get username, email, password, firstName, lastName, gender, phone, dateOfBirth, role from req.body
    // Validate if all data are provided
    // Check if the user already exists in the database
    // If the user exists, throw an error "User already exists"
    // Create a new user
    // Generate an auth token
    // Save the user to the database
    // Send the response with the user and auth token
    // Catch any error and pass it to the error handler

    const { email, password, firstName, lastName } = req.body;
    let role = req.body?.role;

    if (!email || !password || !firstName || !lastName) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Please provide all required fields"
        );
    }
    if (!role) {
        role = "user";
    }
    console.log(role);
    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "User with username or email already exists"
        );
    }
    const username = userNameGenerator(firstName, lastName);

    try {
        const user = await User.create({
            username,
            email,
            password,
            firstName,
            lastName,
            role,
        });

        const authToken = user.generateAuthToken();
        user.authToken = authToken;
        await user.save();

        const verificationToken = user.generateVerificationToken();
        await user.save();

        // Send verification email

        await sendVerificationEmail(user, verificationToken);

        return res
            .status(HTTP_CREATED)
            .json(
                new ApiResponse(HTTP_CREATED, "User created successfully", user)
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const verifyEmail = asyncHandler(async (req, res) => {
    // Get the verification token from req.params
    // Validate and sanitize the verification token
    // Find the user by the verification token
    // If the user does not exist, throw an error "Invalid or expired verification token"
    // Check if the verification token has expired
    // If the verification token has expired, throw an error "Verification token has expired"
    // Update the user's emailVerified to true
    // Send the response with the message "Email verified successfully"
    // Send the welcome email
    // Catch any error and pass it to the error handler

    const token = req.params?.token || req.query?.token;
    console.log(token);

    if (!token) {
        throw new ApiError(HTTP_BAD_REQUEST, "Verification token is required");
    }

    try {
        // Find the user by verification token and update the emailVerified status
        const user = await User.findOneAndUpdate(
            {
                emailVerificationToken: token,
            },
            {
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationTokenExpires: null,
            },
            { new: true } // Return the updated document
        );

        if (!user) {
            throw new ApiError(
                HTTP_BAD_REQUEST,
                "Invalid or expired verification token"
            );
        }

        // Send welcome email

        await sendWelcomeEmail(user);

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(HTTP_OK, "Email verified successfully", null)
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const resendVerificationEmail = asyncHandler(async (req, res) => {
    // Get the userid from req.user
    // Find the user by the userid
    // If the user does not exist, throw an error "User does not exist"
    // Generate a new verification token
    // Save the new verification token to the database
    // Send the verification email
    // Send the response with the message "Verification email sent successfully"
    // Catch any error and pass it to the error handler

    const userId = req.user._id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(HTTP_NOT_FOUND, "User does not exist");
        }

        if (user.emailVerified) {
            throw new ApiError(HTTP_BAD_REQUEST, "Email already verified");
        }
        const verificationToken = user.generateVerificationToken();
        user.emailVerificationToken = verificationToken;
        await user.save();

        // Send verification email

        await sendVerificationEmail(user, verificationToken);

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Verification email sent successfully",
                    null
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const loginUser = asyncHandler(async (req, res) => {
    // Get email and password from req.body
    // Validate if all data are provided
    // Check if the user exists in the database
    // If the user does not exist, throw an error "User does not exist"
    // Check if the password is correct
    // If the password is incorrect, throw an error "Incorrect password"
    // send the response with the user and auth token
    // Catch any error and pass it to the error handler

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Please provide all required fields"
        );
    }
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(HTTP_NOT_FOUND, "User does not exist");
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            throw new ApiError(HTTP_UNAUTHORIZED, "Incorrect password");
        }

        return res
            .status(HTTP_OK)
            .cookie("authToken", user.authToken, options)
            .json(
                new ApiResponse(HTTP_OK, "User logged in successfully", {
                    user,
                })
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    // Clear cookies
    // Send the response with the message "User logged out successfully"
    // Catch any error and pass it to the error handler

    try {
        return res
            .clearCookie("authToken", options)
            .status(HTTP_OK)
            .json(
                new ApiResponse(HTTP_OK, "User logged out successfully", null)
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    // Get current password, new password, and confirm new password from req.body
    // Validate and sanitize all data provided
    // Check if the new password and confirm new password match
    // If the new password and confirm new password do not match, throw an error "Passwords do not match"
    // Check if the current password is correct
    // If the current password is incorrect, throw an error "Incorrect password"
    // Update the user's password
    // Send the response with the message "Password changed successfully"
    // Catch any error and pass it to the error handler

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Please provide all required fields"
        );
    }

    if (newPassword !== confirmNewPassword) {
        throw new ApiError(HTTP_BAD_REQUEST, "Passwords do not match");
    }

    try {
        const user = req.user;
        const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

        if (!isPasswordCorrect) {
            throw new ApiError(HTTP_FORBIDDEN, "Incorrect Old password");
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });    

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(HTTP_OK, "Password changed successfully", null)
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const forgotPassword = asyncHandler(async (req, res) => {
    // Get email from req.body
    // Validate and sanitize the email
    // Check if the user exists in the database
    // If the user does not exist, throw an error "User does not exist"
    // Generate a reset token
    // Save the reset token to the database
    // Send an email to the user with the reset token
    // Send the response with the message "Reset token sent successfully"
    // Catch any error and pass it to the error handler

    const { email } = req.body;

    if (!email) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Please provide all required fields"
        );
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(HTTP_NOT_FOUND, "User does not exist");
        }

        const resetToken = user.generateResetToken();

        user.resetToken = resetToken;
        await user.save();

        // Send email with reset token

        const response = await sendResetPasswordEmail(email, resetToken);

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Reset password email sent successfully",
                    null
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    // Get the reset token, new password, and confirm new password from req.body
    // Validate and sanitize all data provided
    // Check if the new password and confirm new password match
    // If the new password and confirm new password do not match, throw an error "Passwords do not match"
    // Find the user by the reset token
    // If the user does not exist, throw an error "Invalid or expired reset token"
    // Check if the reset token has expired
    // If the reset token has expired, throw an error "Reset token has expired"
    // Update the user's password
    // Send the response with the message "Password reset successfully"
    // Catch any error and pass it to the error handler

    const resetToken = req.query?.token;
    const { newPassword, confirmNewPassword } = req.body;

    if (!resetToken || !newPassword || !confirmNewPassword) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Please provide all required fields"
        );
    }

    if (newPassword !== confirmNewPassword) {
        throw new ApiError(HTTP_BAD_REQUEST, "Passwords do not match");
    }

    try {
        const user = await User.findOneAndUpdate(
            { resetToken },
            {
                resetToken: null,
                resetTokenExpires: null,
                password: newPassword,
            }
        );

        if (!user) {
            throw new ApiError(
                HTTP_BAD_REQUEST,
                "Invalid or expired reset token"
            );
        }

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(HTTP_OK, "Password reset successfully", null)
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const getUserProfile = asyncHandler(async (req, res) => {
    // Get the user from req.user
    // Send the response with the user
    // Catch any error and pass it to the error handler

    try {
        const user = req.user;
        return res
            .status(HTTP_OK)
            .json(new ApiResponse(HTTP_OK, "User profile", user));
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    // Get the user data from req.body
    // Validate and sanitize the user data
    // Get the user from req.user
    // Get the user id from req.user
    // Check if the user exists in the database
    // If the user does not exist, throw an error "User does not exist"
    // Update the user data
    // Save the user data
    // Send the response with the updated user data
    // Catch any error and pass it to the error handler

    const { firstName, lastName, gender, phone, dateOfBirth } = req.body;
    if (!firstName || !lastName || !gender || !phone || !dateOfBirth) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Please provide all required fields"
        );
    }

    const userId = req.user._id;

    try {
        const user = await User.findByIdAndUpdate(
            { _id: userId },
            {
                firstName,
                lastName,
                gender,
                phone,
                dateOfBirth,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            throw new ApiError(
                HTTP_UNAUTHORIZED,
                "Not authorized to update user"
            );
        }

        return res
            .status(HTTP_OK)
            .json(new ApiResponse(HTTP_OK, "User updated successfully", user));
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const updateUsername = asyncHandler(async (req, res) => {
    // Get the username from req.body
    // Validate and sanitize the username
    // Get the user from req.user
    // Get the user id from req.user
    // Check if the user exists in the database
    // If the user does not exist, throw an error "User does not exist"
    // Check if the username already exists in the database
    // If the username exists, throw an error "Username already exists"
    // Update the username
    // Save the user data
    // Send the response with the updated user data
    // Catch any error and pass it to the error handler

    const { username } = req.body;

    if (!username) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Please provide all required fields"
        );
    }

    const userId = req.user._id;

    try {
        const existingUser = await User.findOne({
            $or: [
                { username }, // Check if the username exists
                { _id: userId }, // Fetch the user by ID to update
            ],
        });

        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            throw new ApiError(HTTP_BAD_REQUEST, "Username already exists");
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            throw new ApiError(
                HTTP_UNAUTHORIZED,
                "Not authorized to update user"
            );
        }

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "Username updated successfully",
                    updatedUser
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

const updateUserAddress = asyncHandler(async (req, res) => {
    // Get the address data from req.body
    // Validate and sanitize the address data
    // Get the user from req.user
    // Get the user id from req.user
    // Update the address table with the address data
    // Update the user with the address id
    // Save the user data
    // Send the response with the updated user data
    // Catch any error and pass it to the error handler

    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(
            HTTP_UNAUTHORIZED,
            "You are not authorized to update user address"
        );
    }

    const { street, city, state, postalCode, country } = req.body;

    if (!street || !city || !state || !postalCode || !country) {
        throw new ApiError(
            HTTP_BAD_REQUEST,
            "Please provide all required fields"
        );
    }

    try {
        const address = await Address.create(
            [
                {
                    userId,
                    street,
                    city,
                    state,
                    postalCode,
                    country,
                },
            ],
            { session }
        );

        await User.findByIdAndUpdate(
            userId,
            { addressId: address._id },
            { new: true, runValidators: true, session }
        );

        await session.commitTransaction();

        const updatedUser = await User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "Address",
                    localField: "addressId",
                    foreignField: "_id",
                    as: "address",
                },
            },
            { $unwind: "$address" },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    address: 1,
                },
            },
        ]);

        if (!updatedUser.length) {
            throw new ApiError(HTTP_NOT_FOUND, "User not found");
        }

        return res
            .status(HTTP_OK)
            .json(
                new ApiResponse(
                    HTTP_OK,
                    "User address updated successfully",
                    updatedUser[0]
                )
            );
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    updateUsername,
    updateUserAddress,
    verifyEmail,
    resendVerificationEmail,
};
