import { Router } from "express";
import {
    createReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview,
} from "../controllers/review.controller.js";
import {verifyToken} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getReviews);
router.route("/:reviewId").get(getReview);
router.route("/create").post(verifyToken, createReview);
router.route("/update/:reviewId").put(verifyToken, updateReview);
router.route("/delete/:reviewId").delete(verifyToken, deleteReview);

export default router;
