import { Router } from "express";
import {
    addToWishlist,
    removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/").post(verifyToken, addToWishlist);

router.route("/:id").delete(verifyToken, removeFromWishlist);

export default router;
