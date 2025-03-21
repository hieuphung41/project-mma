import Product from "../models/product.model.js";
import asyncHandler from "../middlewares/async.midleware.js";
import Wishlist from "../models/wishlist.model.js";
import Cart from "../models/cart.model.js";

// Add a product to the wishlist
export const addToWishlist = asyncHandler(async (req, res, next) => {
  try {
    const { productId, size, color } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    const variant = product.variants.find(
      (v) => v.size === size && v.color === color
    );

    if (!variant) {
      return res
        .status(400)
        .json({ success: false, message: "Variant not available" });
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    // If the wishlist does not exist, create a new wishlist
    if (!wishlist) {
      const newWishlist = new Wishlist({
        user: req.user._id,
        products: [
          {
            product: productId,
            name: product.name,
            image: product.images.length > 0 ? product.images[0] : "",
            price: variant.price,
            size,
            color,
          },
        ],
      });
      await newWishlist.save();
      return res.status(200).json({
        success: true,
        message: "Product added to wishlist successfully",
        data: {
          wishlist: newWishlist,
        },
      });
    }

    // If the wishlist exists, check if the product already exists in the wishlist
    const productIndex = wishlist.products.findIndex(
      (p) =>
        p.product.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    // If the product does not exist, add it to the wishlist
    if (productIndex === -1) {
      wishlist.products.push({
        product: productId,
        name: product.name,
        image: product.images.length > 0 ? product.images[0] : "",
        price: variant.price,
        size,
        color,
      });
      await wishlist.save();
      return res.status(200).json({
        success: true,
        message: "Product added to wishlist successfully",
        data: {
          wishlist: wishlist,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Product already exists in wishlist",
      });
    }
  } catch (error) {
    next(error);
  }
});

// Get the wishlist
export const getWishlist = asyncHandler(async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      const newWishlist = new Wishlist({
        user: req.user._id,
        products: [],
      });
      await newWishlist.save();
      return res.status(200).json({
        success: true,
        message: "Wishlist fetched successfully",
        data: {
          wishlist: newWishlist,
        },
      });
    }
    res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: {
        wishlist: wishlist,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Remove a product from the wishlist
export const removeFromWishlist = asyncHandler(async (req, res, next) => {
  try {
    const { productId, size, color } = req.body;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      const error = new Error("Wishlist not found");
      error.statusCode = 404;
      throw error;
    }
    const productIndex = wishlist.products.findIndex(
      (p) =>
        p.product.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      wishlist.products.splice(productIndex, 1);
      await wishlist.save();
      res.status(200).json({
        success: true,
        message: "Product removed from wishlist successfully",
        data: {
          wishlist: wishlist,
        },
      });
    } else {
      const error = new Error("Product not found in wishlist");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
});
