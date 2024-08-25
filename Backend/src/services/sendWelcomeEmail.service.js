import sendEmail from "../utils/sendEmail.js";

const sendWelcomeEmail = async (user) => {
    try {
        const email = user.email;
        const username = user.username;
        const message = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Welcome to Cladily, ${username}!</h2>
                <p>We're thrilled to have you as a part of our Cladily family. Your style journey begins here, and we're excited to help you find the perfect outfits to express your unique personality.</p>
                ss
                <p>As a thank you for joining us, enjoy <strong>10% off</strong> your first order with the code <strong>WELCOME10</strong>.</p>
                
                <p>Explore our latest collections and get inspired:</p>
                <ul>
                    <li><a href="https://www.cladily.com/new-arrivals" style="color: #d44638;">New Arrivals</a></li>
                    <li><a href="https://www.cladily.com/best-sellers" style="color: #d44638;">Best Sellers</a></li>
                    <li><a href="https://www.cladily.com/latest-trends" style="color: #d44638;">Latest Trends</a></li>
                </ul>
                
                <p>If you have any questions or need styling advice, our team is here to help! Feel free to reach out to us at <a href="mailto:support@cladily.com" style="color: #d44638;">support@cladily.com</a>.</p>
                
                <p>Happy shopping!</p>
                
                <p>Best Regards,<br/>The Cladily Team</p>
                
                <p style="font-size: 12px; color: #777;">Follow us on social media for the latest updates and exclusive offers:</p>
                <p style="font-size: 12px;">
                    <a href="https://www.instagram.com/cladily" style="color: #d44638;">Instagram</a> | 
                    <a href="https://www.facebook.com/cladily" style="color: #d44638;">Facebook</a> | 
                    <a href="https://www.twitter.com/cladily" style="color: #d44638;">Twitter</a>
                </p>
            </div>
        `;
        const subject = "Welcome to Cladily – Your Style Journey Begins Here!";

        const emailResult = await sendEmail(email, subject, message);

        if (emailResult.accepted.length > 0) {
            console.log("Welcome email sent successfully to:", email);
        } else {
            console.log("Failed to send welcome email to:", email);
        }
    } catch (error) {
        console.error("Error sending welcome email:", error.message);
    }
};

export default sendWelcomeEmail;
