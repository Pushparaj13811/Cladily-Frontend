import { HTTP_INTERNAL_SERVER_ERROR } from "../httpStatusCode.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";

const createVerificationCode = async (phone) => {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const user = await User.findOneAndUpdate(
        { phone },
        { phoneVerificationCode: verificationCode },
        { new: true }
    );

    if (!user) {
        throw new ApiError(
            HTTP_INTERNAL_SERVER_ERROR,
            "User with this phone number not found"
        );
    }

    return verificationCode;
};

const sendVerificationCode = async (phone) => {
    try {
        if (!phone) {
            throw new ApiError(
                HTTP_INTERNAL_SERVER_ERROR,
                "Phone number not provided"
            );
        }
        const verificationCode = await createVerificationCode(phone);

        // Placeholder for sending the verification code to the phone
        // You should integrate with an SMS sending service here
        // @airtelmessage.com

        const receiver = phone + "@airtelmessage.com";

        sendEmail({
            to: receiver,
            subject: "Phone Verification Code",
            text: `Your phone verification code is ${verificationCode}`,
        });

        console.log(`Verification code sent to ${phone}: ${verificationCode}`);

        return { message: "Verification code sent" };
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

export default sendVerificationCode;
