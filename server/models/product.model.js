import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    description: {
      type: String,
      required: [true, "Product Description is required"],
      trim: true,
      minLength: 2,
      maxLength: 500,
    },
    totalInStock: {
      type: Number,
      required: [true, "Total Product Stock is required"],
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product Category is required"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Product Brand is required"],
    },
    collections: {
      type: String,
      required: [true, "Product Collections are required"],
    },
    gender: {
      type: String,
      required: [true, "Product Gender is required"],
      enum: ["Men", "Women", "Unisex"],
    },
    images: [],
    variants: [
      {
        size: {
          type: String,
          required: [true, "Size is required"],
        },
        color: {
          type: String,
          required: [true, "Color is required"],
        },
        price: {
          type: Number,
          required: [true, "Product Price is required"],
          min: 0,
        },
        countInStock: {
          type: Number,
          required: [true, "Product Stock is required"],
          min: 0,
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.totalInStock = this.variants.reduce(
    (total, variant) => total + variant.countInStock,
    0
  );
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
