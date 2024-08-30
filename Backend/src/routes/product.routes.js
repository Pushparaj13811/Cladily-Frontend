import Router from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    fetchAllProducts,
    fetchProductById,
} from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { handleDynamicFields,upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(fetchAllProducts);
router.route("/:id").get(fetchProductById);
router.route("/create").post(verifyToken,upload, handleDynamicFields, createProduct);
router.route("/update/:id").put(verifyToken, updateProduct);
router.route("/delete/:id").delete(verifyToken, deleteProduct);

export default router;
