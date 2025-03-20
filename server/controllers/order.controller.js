import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "../middlewares/async.midleware.js";
import mongoose from "mongoose";
import Coupon from "../models/coupon.model.js";
import Address from "../models/address.model.js";
import Cart from "../models/cart.model.js";

export const createOrder = asyncHandler(async (req, res, next) => {
  try {
    const {
      orderItems,
      addressId,
      fullName,
      phone,
      location,
      city,
      country,
      paymentMethod,
      totalPrice,
      couponId,
      priceAfterDiscount, // Payment method passed by the user (optional)
      code, // Response from VNPAY payment gateway
    } = req.body;

    // Check if user choose address or enter each field
    let newAddress = null;
    if (addressId !== null && addressId !== undefined) {
      const existAddress = await Address.findById(addressId);
      if (!existAddress) {
        return res.status(404).json({
          success: false,
          error: "Address not found",
        });
      }
    } else {
      if (!fullName || !phone || !location || !city || !country) {
        return res.status(400).json({
          success: false,
          error: "Please enter full information of address",
        });
      }
      // create new address
      newAddress = new Address({
        user: req.user._id,
        fullName,
        phone,
        location,
        city,
        country,
      });

      await newAddress.save();
    }

    // Check if the coupon exists in the database
    let existCoupon = null;
    if (couponId !== null && couponId !== undefined) {
      existCoupon = await Coupon.findById(couponId);
      if (!existCoupon) {
        return res.status(404).json({
          success: false,
          error: "Coupon not found",
        });
      }
    }

    // check payment method is VNPAY or CoD
    if (paymentMethod === "VNPAY") {
      if (code !== "00") {
        return res.status(400).json({
          success: false,
          error: "Transaction failed",
        });
      }
    } else {
      if (code === "00") {
        return res.status(400).json({
          success: false,
          error: "Please choose VNPAY as payment method",
        });
      }
    }

    // Create the new order
    const newOrder = new Order({
      user: req.user._id,
      orderItems: orderItems,
      address: newAddress ? newAddress._id : addressId,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      coupon: existCoupon ? existCoupon._id : null,
      priceAfterDiscount: priceAfterDiscount,
      isPaid: code ? true : false,
      paidAt: code ? Date.now() : null,
      isDelivered: false,
      deliveredAt: null,
      status: "Processing",
    });

    // Save the order to the database
    await newOrder.save();

    // Clear the cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.products = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    // Update the quantity of the products in the database
    for (let i = 0; i < orderItems.length; i++) {
      const product = await Product.findById(orderItems[i].product);
      if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
      }

      const variantIndex = product.variants.findIndex(
        (v) => v.size === orderItems[i].size && v.color === orderItems[i].color
      );

      if (variantIndex === -1) {
        const error = new Error("Variant not found");
        error.statusCode = 404;
        throw error;
      }

      // Trừ số lượng sản phẩm trong biến thể tương ứng
      product.variants[variantIndex].countInStock -= orderItems[i].quantity;

      if (product.variants[variantIndex].countInStock < 0) {
        const error = new Error("Not enough stock available");
        error.statusCode = 400;
        throw error;
      }

      // Lưu lại sản phẩm vào database
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: { order: newOrder },
    });
  } catch (error) {
    next(error);
  }
});

export const createOrderNow = asyncHandler(async (req, res, next) => {
  try {
    const {
      orderItems,
      addressId,
      fullName,
      phone,
      location,
      city,
      country,
      paymentMethod,
      totalPrice,
      couponId,
      priceAfterDiscount,
      code, // Response from VNPAY payment gateway
    } = req.body;

    // Check if user choose address or enter each field
    let newAddress = null;
    if (addressId !== null && addressId !== undefined) {
      const existAddress = await Address.findById(addressId);
      if (!existAddress) {
        return res.status(404).json({
          success: false,
          error: "Address not found",
        });
      }
    } else {
      if (!fullName || !phone || !location || !city || !country) {
        return res.status(400).json({
          success: false,
          error: "Please enter full information of address",
        });
      }
      // create new address
      newAddress = new Address({
        user: req.user._id,
        fullName,
        phone,
        location,
        city,
        country,
      });

      await newAddress.save();
    }

    // Check if the coupon exists in the database
    let existCoupon = null;
    if (couponId !== null && couponId !== undefined) {
      existCoupon = await Coupon.findById(couponId);
      if (!existCoupon) {
        return res.status(404).json({
          success: false,
          error: "Coupon not found",
        });
      }
    }

    // check payment method is VNPAY or CoD
    if (paymentMethod === "VNPAY") {
      if (code !== "00") {
        return res.status(400).json({
          success: false,
          error: "Transaction failed",
        });
      }
    } else {
      if (code === "00") {
        return res.status(400).json({
          success: false,
          error: "Please choose VNPAY as payment method",
        });
      }
    }

    // Create the new order
    const newOrder = new Order({
      user: req.user._id,
      orderItems: orderItems,
      address: newAddress ? newAddress._id : addressId,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      coupon: existCoupon ? existCoupon._id : null,
      priceAfterDiscount: priceAfterDiscount,
      isPaid: code ? true : false,
      paidAt: code ? Date.now() : null,
      isDelivered: false,
      deliveredAt: null,
      status: "Processing",
    });

    // Save the order to the database
    await newOrder.save();

    // Update the quantity of the products in the database
    for (let i = 0; i < orderItems.length; i++) {
      const product = await Product.findById(orderItems[i].product);
      if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
      }

      const variantIndex = product.variants.findIndex(
        (v) => v.size === orderItems[i].size && v.color === orderItems[i].color
      );

      if (variantIndex === -1) {
        const error = new Error("Variant not found");
        error.statusCode = 404;
        throw error;
      }

      // Trừ số lượng sản phẩm trong biến thể tương ứng
      product.variants[variantIndex].countInStock -= orderItems[i].quantity;

      if (product.variants[variantIndex].countInStock < 0) {
        const error = new Error("Not enough stock available");
        error.statusCode = 400;
        throw error;
      }

      // Lưu lại sản phẩm vào database
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: { order: newOrder },
    });
  } catch (error) {
    next(error);
  }
});

export const getOrderByUserId = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.params;
    let { page, limit } = req.query;

    page = page ? parseInt(page) : 1;
    limit = limit ? parseInt(limit) : 5;

    // Validate User ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid User ID format",
      });
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const skip = (page - 1) * limit;

    // Fetch orders for the user
    const orders = await Order.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("user orderItems address coupon");
    if (!orders) {
      return res.status(404).json({
        success: false,
        error: "No orders found",
      });
    }

    const totalOrders = await Order.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: {
        orders: orders,
        totalPages: totalPages,
        currentPage: page,
        totalOrders: totalOrders,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const getOrders = asyncHandler(async (req, res, next) => {
  try {
    const orders = await Order.find().populate(
      "user orderItems address coupon"
    );
    if (!orders) {
      return res.status(404).json({
        success: false,
        error: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: {
        orders: orders,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const getOrderById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Order ID format",
      });
    }

    const order = await Order.findById(id).populate(
      "user orderItems address coupon"
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: {
        order: order,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const deleteOrderById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid User ID format",
      });
    }

    // delete order
    await Order.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Order is deleted succesfully" });
  } catch (error) {
    next(error);
  }
});
