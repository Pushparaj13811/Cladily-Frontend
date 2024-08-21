import { Router } from "express";
import {
    addToWishlist,
    removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = Router();

router.route("/").post(addToWishlist);

router.route("/:id").delete(removeFromWishlist);

export default router;
