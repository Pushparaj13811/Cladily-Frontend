import { HTTP_INTERNAL_SERVER_ERROR} from "../httpStatusCode.js";
import ApiError from "../utils/apiError.js";
import sendEmail from "../utils/sendEmail.js";

const sendResetPasswordEmail = async (userEmail, resetToken) => {
    try {
        const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const subject = "Reset Your Password";
        const message = `
        <h1>Reset Your Password</h1>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetPasswordUrl}" target="_blank">${resetPasswordUrl}</a>
        <p>If you did not request this, please ignore this email.</p>
    `;

        try {
            await sendEmail(userEmail, subject, message);

        } catch (error) {
            throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
        }
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

export default sendResetPasswordEmail;
