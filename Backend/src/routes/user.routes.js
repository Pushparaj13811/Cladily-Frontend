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
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification-email", verifyToken, resendVerificationEmail);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);
router.post("/change-password", verifyToken, changeCurrentPassword);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.get("/get-user-profile", verifyToken, getUserProfile);
router.patch("/update-profile", verifyToken, updateUserProfile);
router.patch("/update-username", verifyToken, updateUsername);
router.patch("/update-address", verifyToken, updateUserAddress);
router.get("/get-user-address", verifyToken, getUserAddress);
router.delete("/delete-address/:addressId", verifyToken, deleteUserAddress);

export default router;
