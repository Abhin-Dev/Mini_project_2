import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", auth, createProduct);       // seller only
router.put("/:id", auth, updateProduct);     // seller/admin only
router.delete("/:id", auth, deleteProduct);  // seller/admin only

export default router;
