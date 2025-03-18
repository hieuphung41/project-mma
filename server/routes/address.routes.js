import express from "express";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  getAddressList,
} from "../controllers/address.controller.js";
import {
  authenticate,
} from "../middlewares/auth.middleware.js";

const addressRouter = express.Router();

addressRouter.get("/",authenticate, getAddressList);
addressRouter.post("/", authenticate,createAddress);
addressRouter.put("/:addressId", authenticate,updateAddress);
addressRouter.delete("/:addressId", authenticate,deleteAddress);
// router.put("/default/:addressId", authenticate,setDefaultAddress);

export default addressRouter;
