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

// Chuyển một sản phẩm từ wishlist sang cart
export const moveToCart = asyncHandler(async (req, res, next) => {
  try {
    const { productId, size, color } = req.body;

    // Tìm sản phẩm trong wishlist của người dùng
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

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    // Lấy sản phẩm từ wishlist
    const product = wishlist.products[productIndex];

    // Kiểm tra xem sản phẩm đã có trong cart chưa
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      // Nếu không có cart, tạo cart mới
      cart = new Cart({
        user: req.user._id,
        products: [],
        totalPrice: 0,
      });
    }

    const productInCart = cart.products.find(
      (p) =>
        p.product.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    // Nếu sản phẩm đã có trong cart, chỉ cần cập nhật số lượng
    if (productInCart) {
      productInCart.quantity += 1; // Tăng số lượng lên 1 khi đã có sản phẩm trong cart
    } else {
      // Nếu chưa có trong cart, thêm sản phẩm vào cart với quantity = 1
      cart.products.push({
        product: productId,
        name: product.name,
        image: product.image,
        price: product.price,
        size,
        color,
        quantity: 1, // Mặc định quantity là 1
      });
    }

    // Cập nhật tổng giá trị của cart
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Lưu cart và xóa sản phẩm khỏi wishlist
    await cart.save();
    wishlist.products.splice(productIndex, 1); // Xóa sản phẩm khỏi wishlist
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product moved to cart successfully",
      data: {
        cart,
        wishlist,
      },
    });
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
