import crypto from "crypto";

const generateGuestToken = async () => {
    return crypto.randomBytes(32).toString("hex");
};

export { generateGuestToken };
