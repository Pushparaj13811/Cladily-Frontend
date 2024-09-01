import { Router } from "express";
import {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
} from "../controllers/shoppingCart.controller.js";
import { optionalVerifyToken} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(optionalVerifyToken, getCart);
router.route("/add").post(optionalVerifyToken, addToCart);
router.route("/update").put(optionalVerifyToken, updateCart);
router.route("/remove").delete(optionalVerifyToken, removeFromCart);
router.route("/clear").delete(optionalVerifyToken, clearCart);

export default router;
