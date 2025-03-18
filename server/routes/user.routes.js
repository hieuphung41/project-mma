import { Router } from "express";
import {
  deleteUserByID,
  forgotPassword,
  getUser,
  getUsers,
  resetPassword,
  updateUserByID,
} from "../controllers/user.controller.js";
import {
  authenticate,
  authorizeAdmin,
} from "../middlewares/auth.middleware.js";

const userRouter = Router();
//ADMIN ROUTES:

userRouter.get("/", authenticate, authorizeAdmin, getUsers);

//PUBLIC ROUTES:

userRouter.get("/:id", authenticate, getUser);
userRouter.put("/:id", authenticate, updateUserByID);
userRouter.delete("/:id", authenticate, deleteUserByID);
userRouter.route("/forgot_password").post(forgotPassword);
userRouter.route("/reset_password/:token").post(resetPassword);

export default userRouter;
