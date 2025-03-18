import Category from "../models/category.model.js";
import asyncHandler from "../middlewares/async.midleware.js";
import Product from "../models/product.model.js";

// Create a new category
export const createCategory = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      const error = new Error("Category already exists");
      error.statusCode = 409;
      throw error;
    }
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category: newCategory,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all categories
export const getCategories = asyncHandler(async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: {
        categories: categories,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get a single category
export const getCategory = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: {
        category: category,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update a category
export const updateCategory = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }
    category.name = req.body.name || category.name;
    await category.save();
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        category: category,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Delete a category
export const deleteCategory = asyncHandler(async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    // Find all products with the given category
    const products = await Product.find({ category: category._id });

    // Delete all products with this category
    if (products.length > 0) {
      await Product.deleteMany({ category: category._id });
    }
    await category.deleteOne();
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
