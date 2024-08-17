import sendEmail from "../utils/sendEmail";

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

        if (emailResult.accepted.length > 0) {
            console.log("Verification email sent successfully to:", user.email);
        } else {
            console.log("Failed to send verification email to:", user.email);
        }
    } catch (error) {
        console.error("Error sending verification email:", error.message);
        throw new Error(
            "There was an error sending the verification email. Please try again later."
        );
    }
};

export default sendVerificationEmail;
