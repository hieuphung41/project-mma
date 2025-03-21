import { Router } from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const wishlistRouter = Router();

wishlistRouter.post("/add", authenticate, addToWishlist);
wishlistRouter.get("/", authenticate, getWishlist);
wishlistRouter.delete("/remove", authenticate, removeFromWishlist);

export default wishlistRouter;
