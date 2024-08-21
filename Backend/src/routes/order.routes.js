import { Router } from "express";
import {
    createOrder,
    getOrders,
    updateOrderStatus,
    cancelOrder,
    cancelOrderItems,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/").get(getOrders);
router.route("/create").post(createOrder);
router.route("/update/:orderId").put(updateOrderStatus);
router.route("/cancel/:orderId").delete(cancelOrder);
router.route("/cancel-item").delete(cancelOrderItems);

export default router;
