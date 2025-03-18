import { Router } from "express";
import {
  createOrder,
  deleteOrderById,
  getOrderByUserId,
  getOrderById,
  getOrders,
  createOrderNow,
} from "../controllers/order.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

const orderRouter = Router();

orderRouter.post("/", authenticate, createOrder);
orderRouter.post("/now", authenticate, createOrderNow);
orderRouter.get("/", authenticate, authorizeAdmin, getOrders);
orderRouter.get("/:id", authenticate, getOrderById);
orderRouter.get("/user/:userId", authenticate, getOrderByUserId);
orderRouter.delete("/:id", authenticate, authorizeAdmin, deleteOrderById);

export default orderRouter;
