import nodemailer from "nodemailer";
import { google } from "googleapis";
import ApiError from "./apiError.js";
import { HTTP_INTERNAL_SERVER_ERROR } from "../httpStatusCode.js";

const sendEmail = async (email, subject, message) => {
    const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
    const {
        EMAIL_CLIENT_ID,
        EMAIL_CLIENT_SECRET,
        EMAIL_REFRESH_TOKEN,
        EMAIL_USER,
    } = process.env;

    const oauth2Client = new google.auth.OAuth2(
        EMAIL_CLIENT_ID,
        EMAIL_CLIENT_SECRET,
        OAUTH_PLAYGROUND
    );

    try {
        oauth2Client.setCredentials({ refresh_token: EMAIL_REFRESH_TOKEN });

        const { token } = await oauth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: EMAIL_USER,
                clientId: EMAIL_CLIENT_ID,
                clientSecret: EMAIL_CLIENT_SECRET,
                refreshToken: EMAIL_REFRESH_TOKEN,
                accessToken: token,
            },
        });

        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject,
            html: message,
        };

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        throw new ApiError(HTTP_INTERNAL_SERVER_ERROR, error.message);
    }
};

export default sendEmail;
