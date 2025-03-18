import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
  uploadProductImages,
  deleteProductImages,
  updateProductImages,
} from "../controllers/product.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";
import {
  productImageResize,
  uploadPhoto,
} from "../middlewares/uploadImages.middleware.js";

const productRouter = Router();

productRouter.post(
  "/",
  authenticate,
  authorizeAdmin,
  uploadPhoto.array("images", 5),
  productImageResize,
  createProduct
);
productRouter.post(
  "/:id/upload-images",
  authenticate,
  authorizeAdmin,
  uploadPhoto.array("images", 5),
  productImageResize,
  uploadProductImages
);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  uploadPhoto.array("images", 5),
  productImageResize,
  updateProduct
);
productRouter.put(
  "/:id/update-images",
  authenticate,
  authorizeAdmin,
  uploadPhoto.array("images", 5),
  productImageResize,
  updateProductImages
);
productRouter.delete("/:id", authenticate, authorizeAdmin, deleteProduct);
productRouter.delete(
  "/:id/delete-images",
  authenticate,
  authorizeAdmin,
  deleteProductImages
);

export default productRouter;
