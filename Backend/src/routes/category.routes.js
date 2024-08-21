import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
} from "../controllers/category.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getCategories);
router.route("/create").post(verifyToken, createCategory);
router.route("/delete/:categoryId").delete(verifyToken, deleteCategory);

export default router;
