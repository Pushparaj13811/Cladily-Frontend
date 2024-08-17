import { HTTP_INTERNAL_SERVER_ERROR, HTTP_OK } from "../httpStatusCode.js";
import ApiError from "../utils/apiError.js";
import sendEmail from "../utils/sendEmail.js";

const sendVerificationEmail = async (user, verificationToken) => {
    try {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const message = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Email Verification Required</h2>
                <p>Dear ${user.username},</p>
                <p>Thank you for registering with Cladily. Please click the link below to verify your email address:</p>
                <p><a href="${verificationUrl}" style="color: #d44638;">Verify Email</a></p>
                <p>This link will expire in 24 hours. If you did not sign up for an account with us, please ignore this email.</p>
                <p>Thank you,<br/>The Cladily Team</p>
            </div>
        `;
        const subject = "Cladily - Verify Your Email Address";

        // Send the email
        const emailResult = await sendEmail(user.email, subject, message);

        if (!(emailResult.accepted.length > 0)) {
            throw new ApiError(
                HTTP_INTERNAL_SERVER_ERROR,
                "Failed to send verification email."
            );
        }
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

export default sendVerificationEmail;
