import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

const sendEmail = async (email, subject, message) => {
    const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
    const {
        EMAIL_CLIENT_ID,
        EMAIL_CLIENT_SECRET,
        EMAIL_REFRESH_TOKEN,
        EMAIL_USER,
    } = process.env;

    const oauth2Client = new OAuth2Client(
        EMAIL_CLIENT_ID,
        EMAIL_CLIENT_SECRET,
        OAUTH_PLAYGROUND
    );

    try {
        oauth2Client.setCredentials({ refresh_token: EMAIL_REFRESH_TOKEN });
        const accessToken = await oauth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: EMAIL_USER,
                clientId: EMAIL_CLIENT_ID,
                clientSecret: EMAIL_CLIENT_SECRET,
                refreshToken: EMAIL_REFRESH_TOKEN,
                accessToken: accessToken.token,
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
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default sendEmail;
