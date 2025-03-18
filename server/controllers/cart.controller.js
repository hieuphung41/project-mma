import Product from "../models/product.model.js";
import asyncHandler from "../middlewares/async.midleware.js";
import Cart from "../models/cart.model.js";

// Add a product to the cart
export const addToCart = asyncHandler(async (req, res, next) => {
  try {
    const { productId, size, color, quantity } = req.body;
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

    const cart = await Cart.findOne({ user: req.user._id });
    // If the cart does not exist, create a new cart
    if (!cart) {
      const newCart = new Cart({
        user: req.user._id,
        products: [
          {
            product: productId,
            name: product.name,
            image: product.images.length > 0 ? product.images[0] : "",
            price: variant.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: variant.price * quantity,
      });
      await newCart.save();
      return res.status(200).json({
        success: true,
        message: "Product added to cart successfully",
        data: {
          cart: newCart,
        },
      });
    }
    // If the cart exists, check if the product already exists in the cart
    const productIndex = cart.products.findIndex(
      (p) =>
        p.product.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    // If the product exists, update the quantity
    if (productIndex > -1) {
      cart.products[productIndex].quantity += Number(quantity);
      await cart.save();
    } else {
      // If the product does not exist, add it to the cart
      cart.products.push({
        product: productId,
        name: product.name,
        image: product.images.length > 0 ? product.images[0] : "",
        price: variant.price,
        size,
        color,
        quantity,
      });
    }
    // Update the total price
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: {
        cart: cart,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update the quantity of a product in the cart
export const updateCart = asyncHandler(async (req, res, next) => {
  try {
    const { productId, size, color, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404;
      throw error;
    }
    const productIndex = cart.products.findIndex(
      (p) =>
        p.product.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      // Update the quantity
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        // Remove the product if the quantity is 0
        cart.products.splice(productIndex, 1);
      }
      // Update the total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: {
          cart: cart,
        },
      });
    } else {
      const error = new Error("Product not found in cart");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

// Get the cart
export const getCart = asyncHandler(async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      const newCart = new Cart({
        user: req.user._id,
        products: [],
        totalPrice: 0,
      });
      await newCart.save();
      return res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        data: {
          cart: newCart,
        },
      });
    }
    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: {
        cart: cart,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Remove a product from the cart
export const removeFromCart = asyncHandler(async (req, res, next) => {
  try {
    const { productId, size, color } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      const error = new Error("Cart not found");
      error.statusCode = 404;
      throw error;
    }
    const productIndex = cart.products.findIndex(
      (p) =>
        p.product.toString() === productId &&
        p.size === size &&
        p.color === color
    );
    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      // Update the total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      res.status(200).json({
        success: true,
        message: "Product removed from cart successfully",
        data: {
          cart: cart,
        },
      });
    } else {
      const error = new Error("Product not found in cart");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
});
