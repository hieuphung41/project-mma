import Coupon from "../models/coupon.model.js";
import asyncHandler from "../middlewares/async.midleware.js";
import Product from "../models/product.model.js";

// Create a new coupon
export const createCoupon = asyncHandler(async (req, res, next) => {
  try {
    const { name, expiry, discount } = req.body;
    const existingcoupon = await Coupon.findOne({ name });
    if (existingcoupon) {
      const error = new Error("Coupon already exists");
      error.statusCode = 409;
      throw error;
    }
    const newcoupon = new Coupon({
      name,
      expiry,
      discount,
    });
    await newcoupon.save();
    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: {
        coupon: newcoupon,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all coupons
export const getCoupons = asyncHandler(async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({
      success: true,
      message: "Coupons fetched successfully",
      data: {
        coupons: coupons,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get a single coupon
export const getCoupon = asyncHandler(async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      const error = new Error("Coupon not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "Coupon fetched successfully",
      data: {
        coupon: coupon,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update a coupon
export const updateCoupon = asyncHandler(async (req, res, next) => {
  try {
    const { name, expiry, discount } = req.body;

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      const error = new Error("Coupon not found");
      error.statusCode = 404;
      throw error;
    }
    coupon.name = name || coupon.name;
    coupon.expiry = expiry || coupon.expiry;
    coupon.discount = discount || coupon;

    await coupon.save();
    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: {
        coupon: coupon,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Delete a coupon
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      const error = new Error("Coupon not found");
      error.statusCode = 404;
      throw error;
    }

    // Find all products with the given coupon
    const products = await Product.find({ coupon: coupon._id });

    // Delete all products with this coupon
    if (products.length > 0) {
      await Product.deleteMany({ coupon: coupon._id });
    }
    await coupon.deleteOne();
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

export const getCouponByName = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.params;
    const coupon = await Coupon.findOne({ name });
    if (!coupon) {
      const error = new Error("Coupon not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "Coupon fetched successfully",
      data: {
        coupon: coupon,
      },
    });
  } catch (error) {
    next(error);
  }
});