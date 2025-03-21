import { Router } from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  moveToCart
} from "../controllers/wishlist.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const wishlistRouter = Router();

wishlistRouter.post("/add", authenticate, addToWishlist);
wishlistRouter.put("/move-to-cart", authenticate, moveToCart);
wishlistRouter.get("/", authenticate, getWishlist);
wishlistRouter.delete("/remove", authenticate, removeFromWishlist);

export default wishlistRouter;
