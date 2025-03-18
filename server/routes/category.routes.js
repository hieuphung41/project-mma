import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.post("/", authenticate, authorizeAdmin, createCategory);
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategory);
categoryRouter.put("/:id", authenticate, authorizeAdmin, updateCategory);
categoryRouter.delete("/:id", authenticate, authorizeAdmin, deleteCategory);

export default categoryRouter;
