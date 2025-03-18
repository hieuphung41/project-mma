import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Brand from "../models/brand.model.js";
import asyncHandler from "../middlewares/async.midleware.js";
import fs from "fs";
import {
  cloudinaryUploadImage,
  // cloudinaryDeleteImage,
} from "../utils/cloudinary.js";

// Create a new product
// export const createProduct = asyncHandler(async (req, res, next) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       countInStock,
//       category,
//       brand,
//       sizes,
//       colors,
//       collections,
//       gender,
//       isFeatured,
//       isPublished,
//     } = req.body;

//     // Check if the category and brand exist
//     const existingCategory = await Category.findById(category);
//     if (!existingCategory) {
//       const error = new Error("Category not found");
//       error.statusCode = 404;
//       throw error;
//     }
//     const existingBrand = await Brand.findById(brand);
//     if (!existingBrand) {
//       const error = new Error("Brand not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     const newProduct = new Product({
//       name,
//       description,
//       price,
//       countInStock,
//       category: existingCategory, // Assign the existing category
//       brand: existingBrand, // Assign the existing brand
//       sizes,
//       colors,
//       collections,
//       gender,
//       images: [],
//       isFeatured,
//       isPublished,
//     });
//     await newProduct.save();
//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       data: {
//         product: newProduct,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// Create a new product
export const createProduct = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      collections,
      gender,
      variants,
      isFeatured,
      isPublished,
    } = req.body;

    // Convert variants from JSON string (because it's sent as text in form-data)
    const parsedVariants = JSON.parse(variants);

    // Check if the category and brand exist
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const existingBrand = await Brand.findById(brand);
    if (!existingBrand) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    // Handle file uploads using Cloudinary for product images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          try {
            const uploadResult = await cloudinaryUploadImage(file.path);

            fs.unlink(file.path, (err) => {
              if (err) console.error("Error deleting temp file:", err);
              else console.log(`Deleted temp image: ${file.path}`);
            });

            return uploadResult.url;
          } catch (error) {
            console.error("Cloudinary upload error:", error);
            return null;
          }
        })
      );

      imageUrls.push(...uploadedImages.filter((url) => url !== null));
    }

    // Calculate total stock from variants
    const totalInStock = parsedVariants.reduce(
      (total, variant) => total + variant.countInStock,
      0
    );

    // Create the product
    const newProduct = new Product({
      name,
      description,
      totalInStock,
      category: existingCategory,
      brand: existingBrand,
      collections,
      gender,
      variants: parsedVariants, // Attach variants from the parsed JSON
      images: imageUrls, // Attach images for the product
      isFeatured,
      isPublished,
    });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all products
export const getProducts = asyncHandler(async (req, res, next) => {
  try {
    const {
      collections,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      brand,
      limit,
      page,
    } = req.query;

    const query = {};

    // Filter by collections
    if (collections && collections.toLowerCase() !== "all") {
      query.collections = collections;
    }

    // Filter by category
    if (category) {
      const categories = await Category.find({
        name: { $in: category.split(",") },
      });
      const categoryIds = categories.map((cat) => cat._id);
      query.category = { $in: categoryIds };
    }

    // Filter by brand
    if (brand) {
      const brands = await Brand.find({ name: { $in: brand.split(",") } });
      const brandIds = brands.map((b) => b._id);
      query.brand = { $in: brandIds };
    }

    // Filter by gender
    if (gender) {
      query.gender = gender;
    }

    if (size) {
      query["variants.0.size"] = { $in: size.split(",") };
    }

    if (color) {
      query["variants.0.color"] = { $in: color.split(",") };
    }

    // if (minPrice || maxPrice) {
    //   query["variants.0.price"] = {};
    //   if (minPrice) {
    //     query["variants.0.price"].$gte = Number(minPrice);
    //   }
    //   if (maxPrice) {
    //     query["variants.0.price"].$lte = Number(maxPrice);
    //   }
    // }
    if (minPrice || maxPrice) {
      query["variants"] = { $elemMatch: {} };
      if (minPrice) {
        query["variants"].$elemMatch.price = { $gte: Number(minPrice) };
      }
      if (maxPrice) {
        query["variants"].$elemMatch.price = { $lte: Number(maxPrice) };
      }
    }

    // Search by name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { "variants.0.price": 1 };
          break;
        case "priceDesc":
          sort = { "variants.0.price": -1 };
          break;
        default:
          break;
      }
    }

    const pageNumber = page ? Number(page) - 1 : 0;
    const products = await Product.find(query)
      .populate("category")
      .populate("brand")
      .sort(sort)
      .limit(Number(limit) || 0)
      .skip(pageNumber * (Number(limit) || 0));

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: {
        products,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get a single product
export const getProduct = asyncHandler(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("brand");
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: {
        product: product,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update a product
export const updateProduct = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      collections,
      gender,
      variants, // JSON string containing variants array
      isFeatured,
      isPublished,
      removeImages, // Array of image URLs to remove
    } = req.body;

    console.log(name);

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Check if the category and brand exist (if provided)
    let existingCategory = product.category;
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
      existingCategory = categoryExists._id;
    }

    let existingBrand = product.brand;
    if (brand) {
      const brandExists = await Brand.findById(brand);
      if (!brandExists) {
        return res
          .status(404)
          .json({ success: false, message: "Brand not found" });
      }
      existingBrand = brandExists._id;
    }

    // Handle image removal
    let updatedImages = product.images;
    if (removeImages) {
      const imagesToRemove = JSON.parse(removeImages); // Convert from JSON string
      updatedImages = product.images.filter(
        (img) => !imagesToRemove.includes(img)
      );
    }

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const uploadedImage = await cloudinaryUploadImage(file.path);
        try {
          fs.unlinkSync(file.path); // Remove temp file
        } catch (err) {
          console.error("Error removing temp file:", err);
        }
        return uploadedImage.url;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      updatedImages.push(...newImageUrls);
    }

    // Parse variants from JSON string (if provided)
    let updatedVariants = product.variants;
    if (variants) {
      updatedVariants = JSON.parse(variants);
    }

    // Calculate total stock from updated variants
    const totalInStock = updatedVariants.reduce(
      (total, variant) => total + variant.countInStock,
      0
    );

    // Update product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.category = existingCategory;
    product.brand = existingBrand;
    product.collections = collections || product.collections;
    product.gender = gender || product.gender;
    product.variants = updatedVariants;
    product.images = updatedImages;
    product.totalInStock = totalInStock;
    product.isFeatured =
      isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isPublished =
      isPublished !== undefined ? isPublished : product.isPublished;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
});

// Delete a product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// Upload product images
export const uploadProductImages = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.images.length + req.files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "You can only upload up to 5 images.",
      });
    }

    const uploader = (path) => cloudinaryUploadImage(path, "images");

    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      console.log(newPath);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { images: [...urls] } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    next(error);
  }
});

// // Update product images
// export const updateProductImages = asyncHandler(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { retainedImages } = req.body;

//     const product = await Product.findById(id);
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     const oldImages = product.images;
//     const oldPublicIds = oldImages.map((img) => img.public_id);
//     const retainedPublicIds = retainedImages.map((img) => img.public_id);
//     const imagesToDelete = oldPublicIds.filter(
//       (id) => !retainedPublicIds.includes(id)
//     );

//     await Promise.all(
//       imagesToDelete.map(async (publicId) => {
//         try {
//           await cloudinaryDeleteImage(publicId);
//         } catch (err) {
//           console.error(`Failed to delete image ${publicId}:`, err);
//         }
//       })
//     );

//     const uploader = (path) => cloudinaryUploadImage(path, "images");
//     const newImages = [];
//     const files = req.files || [];
//     for (const file of files) {
//       const { path } = file;
//       const newPath = await uploader(path);
//       newImages.push(newPath);
//       fs.unlinkSync(path);
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { $set: { images: [...retainedImages, ...newImages] } },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Product images updated successfully",
//       data: { product: updatedProduct },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// Update product images
export const updateProductImages = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    let retainedImages = [];
    if (req.body.retainedImages) {
      try {
        retainedImages = JSON.parse(req.body.retainedImages);
      } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid retainedImages format" });
      }
    }

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Kiểm tra số lượng ảnh hợp lệ
    const totalImages = retainedImages.length + req.files.length;
    if (totalImages > 5) {
      return res.status(400).json({
        success: false,
        message: "You can only have up to 5 images.",
      });
    }

    const uploader = (path) => cloudinaryUploadImage(path, "images");
    const newImages = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      newImages.push(newPath);
      fs.unlinkSync(path);
    }

    // Cập nhật danh sách ảnh với ảnh giữ lại + ảnh mới
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { images: [...retainedImages, ...newImages] } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product images updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    next(error);
  }
});

// Delete product images
export const deleteProductImages = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // const publicIds = product.images.map((img) => img.public_id);

    // // If there are no images to delete
    // if (publicIds.length === 0) {
    //   return res.status(200).json({
    //     success: true,
    //     message: "No images to delete",
    //     data: { product },
    //   });
    // }

    // // Delete all images from Cloudinary
    // const deletionResults = await Promise.allSettled(
    //   publicIds.map((publicId) => cloudinaryDeleteImage(publicId))
    // );

    // deletionResults.forEach((result, index) => {
    //   if (result.status === "rejected") {
    //     console.error(
    //       `Failed to delete image ${publicIds[index]}:`,
    //       result.reason
    //     );
    //   }
    // });

    // Clear images array in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { images: [] } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "All images deleted successfully from Cloudinary and database",
      data: { product: updatedProduct },
    });
  } catch (error) {
    next(error);
  }
});
