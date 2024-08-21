import { Router } from "express";
import {
    createOrder,
    getOrders,
    updateOrderStatus,
    cancelOrder,
    cancelOrderItems,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyToken,getOrders);
router.route("/create").post(verifyToken,createOrder);
router.route("/update/:orderId").put(verifyToken,updateOrderStatus);
router.route("/cancel/:orderId").delete(verifyToken,cancelOrder);
router.route("/cancel-item").delete(verifyToken,cancelOrderItems);

export default router;
