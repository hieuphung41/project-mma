import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import {
  authenticate,
} from "../middlewares/auth.middleware.js";

const cartRouter = Router();

cartRouter.post("/add", authenticate, addToCart);
cartRouter.put("/update", authenticate, updateCart);
cartRouter.get("/", authenticate, getCart);
cartRouter.delete("/remove", authenticate, removeFromCart);

export default cartRouter;
