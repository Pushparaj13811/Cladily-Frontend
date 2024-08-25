import { Router } from "express";
import {
    registerUser,
    verifyEmail,
    resendVerificationEmail,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    forgotPassword,
    getUserProfile,
    updateUserProfile,
    updateUsername,
    updateUserAddress,
    resetPassword,
    getUserAddress,
    deleteUserAddress,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import createGuestSession from "../controllers/guest.controller.js";

const router = Router();

router.route("/").get(createGuestSession);
router.route("/register").post(registerUser);
router.route("/verify-email").post(verifyEmail);
router
    .route("/resend-verification-email")
    .post(verifyToken, resendVerificationEmail);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, logoutUser);
router.route("/change-password").post(verifyToken, changeCurrentPassword);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").patch(resetPassword);
router.route("/get-user-profile").get(verifyToken, getUserProfile);
router.route("/update-profile").patch(verifyToken, updateUserProfile);
router.route("/update-username").patch(verifyToken, updateUsername);
router.route("/update-address").patch(verifyToken, updateUserAddress);
router.route("/get-user-address").get(verifyToken, getUserAddress);
router
    .route("/delete-address/:addressId")
    .delete(verifyToken, deleteUserAddress);

export default router;
