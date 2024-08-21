import { Router } from "express";
import {
    getSale,
    getSales,
    getSaleBySizeAndColor,
} from "../controllers/sales.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getSales);
router.route("/:id").get(getSale);
router
    .route("product/:productId/size/:size/color/:color")
    .get(getSaleBySizeAndColor);

export default router;
