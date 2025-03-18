import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      trim: true,
      unique: true,
    },
    expiry: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    discount: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [1, "Discount must be at least 1%"],
      max: [100, "Discount cannot exceed 100%"],
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
