import Brand from "../models/brand.model.js";
import asyncHandler from "../middlewares/async.midleware.js";
import Product from "../models/product.model.js";

// Create a new brand
export const createBrand = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      const error = new Error("Brand already exists");
      error.statusCode = 409;
      throw error;
    }
    const newBrand = new Brand({ name });
    await newBrand.save();
    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: {
        brand: newBrand,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all brands
export const getBrands = asyncHandler(async (req, res, next) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      data: {
        brands: brands,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get a single brand
export const getBrand = asyncHandler(async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      const error = new Error("Brand not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "Brand fetched successfully",
      data: {
        brand: brand,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update a brand
export const updateBrand = asyncHandler(async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      const error = new Error("Brand not found");
      error.statusCode = 404;
      throw error;
    }
    brand.name = req.body.name || brand.name;
    await brand.save();
    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: {
        brand: brand,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Delete a brand
export const deleteBrand = asyncHandler(async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      const error = new Error("Brand not found");
      error.statusCode = 404;
      throw error;
    }
    // Find all products with the given brand
    const products = await Product.find({ brand: brand._id });

    // Delete all products with this brand
    if (products.length > 0) {
      await Product.deleteMany({ brand: brand._id });
    }

    await brand.deleteOne();
    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
