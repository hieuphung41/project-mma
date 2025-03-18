import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrand,
  updateBrand,
} from "../controllers/brand.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

const brandRouter = Router();

brandRouter.post("/", authenticate, authorizeAdmin, createBrand);
brandRouter.get("/", getBrands);
brandRouter.get("/:id", getBrand);
brandRouter.put("/:id", authenticate, authorizeAdmin, updateBrand);
brandRouter.delete("/:id", authenticate, authorizeAdmin, deleteBrand);

export default brandRouter;
