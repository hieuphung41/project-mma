import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  updateCoupon,
  getCouponByName
} from "../controllers/coupon.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

const couponRouter = Router();

couponRouter.post("/", authenticate, authorizeAdmin, createCoupon);
couponRouter.get("/", getCoupons);
couponRouter.get("/:id", getCoupon);
couponRouter.get("/name/:name", getCouponByName);
couponRouter.put("/:id", authenticate, authorizeAdmin, updateCoupon);
couponRouter.delete("/:id", authenticate, authorizeAdmin, deleteCoupon);

export default couponRouter;
