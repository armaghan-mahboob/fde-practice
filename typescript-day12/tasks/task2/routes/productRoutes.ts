import { Router } from "express";
import * as productController from "../controllers/productController";

const router = Router();

router.get("/", productController.getProducts);
router.post("/", productController.createProduct);
router.get("/stats", productController.getStats);
router.get("/out-of-stock", productController.getOutOfStock);
router.get("/:id", productController.getProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.patch("/:id/stock", productController.updateStock);

export default router;
