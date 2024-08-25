import { Router } from "express";
import {
    addToWishlist,
    getItemsFromWishlist,
    removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/").get(verifyToken, getItemsFromWishlist);
router.route("/add-items/").post(verifyToken, addToWishlist);
router.route("/:id").delete(verifyToken, removeFromWishlist);

export default router;
