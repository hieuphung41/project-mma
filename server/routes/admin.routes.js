import { Router } from "express";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";
import {
  getAllOrders,
  getAllProducts,
  getAllUsers,
  getCustomer,
  getProductsQuantity,
  getRevenue,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get("/dashboard/revenue", authenticate, authorizeAdmin, getRevenue);
adminRouter.get(
  "/dashboard/quantity",
  authenticate,
  authorizeAdmin,
  getProductsQuantity
);

adminRouter.get(
  "/dashboard/customers",
  authenticate,
  authorizeAdmin,
  getCustomer
);

adminRouter.get("/orders", authenticate, authorizeAdmin, getAllOrders);
adminRouter.get("/users", authenticate, authorizeAdmin, getAllUsers);
adminRouter.get("/products", authenticate, authorizeAdmin, getAllProducts);

export default adminRouter;
