import { Router } from "express";
import {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
} from "../controllers/shoppingCart.controller.js";
import {verifyToken, optionalVerifyToken} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(optionalVerifyToken, getCart);
router.route("/add").post(verifyToken, addToCart);
router.route("/update").put(verifyToken, updateCart);
router.route("/remove").delete(verifyToken, removeFromCart);
router.route("/clear").delete(verifyToken, clearCart);

export default router;
