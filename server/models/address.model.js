import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "User ID is required"]
    },
    fullName: { 
      type: String,
      required: [true, "Full name is required"],
      trim: true 
    },
    phone: { 
      type: String, 
      required: [true, "Phone number is required"],
      validate: {
        validator: function(v) {
          return /^0[0-9]{9}$/.test(v); 
        },
        message: `Phone has 10 number and don't have character!`
      }
    },
    location: { 
      type: String, 
      required: [true, "Location is required"],
      trim: true
    },
    city: { 
      type: String, 
      required: [true, "City is required"],
      trim: true 
    },
    country: { 
      type: String, 
      required: [true, "Country is required"],
      trim: true 
    },
    isDefault: { 
      type: Boolean,
      default: false 
    }, 
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
