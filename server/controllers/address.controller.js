import asyncHandler from "../middlewares/async.midleware.js";
import Address from "../models/address.model.js";
import mongoose from 'mongoose';

export const getAddressList = asyncHandler(async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    
    if (addresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "List of addresses is empty",
      });
    }

    res.status(200).json({
      success: true,
      message: "List of addresses",
      data: addresses,
    });

  } catch (error) {
    next(error);
  }
});

// 🟢 Tạo địa chỉ mới
export const createAddress = asyncHandler(async (req, res, next) => {
  try {
    const { fullName, phone, location, city, country } = req.body;
    const userId = req.user._id;
    const existingAddresses = await Address.find({ user: userId });

    const newAddress = new Address({
      user: userId,
      fullName,
      phone,
      location,
      city,
      country,
      isDefault: existingAddresses.length === 0, 
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully!",
      data: newAddress,
    });

  } catch (error) {
    next(error);
  }
});

export const updateAddress = asyncHandler(async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, location, city, country, isDefault } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ success: false, message: "Invalid address ID" });
    }

    const existingAddress = await Address.findById(addressId);
    if (!existingAddress) {
      return res.status(404).json({ success: false, message: "Address not found!" });
    }

    // Cập nhật thông tin
    existingAddress.fullName = fullName || existingAddress.fullName;
    existingAddress.phone = phone || existingAddress.phone;
    existingAddress.address = location || existingAddress.location;
    existingAddress.city = city || existingAddress.city;
    existingAddress.country = country || existingAddress.country;

    if (isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
      existingAddress.isDefault = true;
    }

    await existingAddress.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully!",
      data: existingAddress,
    });

  } catch (error) {
    next(error);
  }
});

export const deleteAddress = asyncHandler(async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ success: false, message: "Invalid address ID" });
    }

    const existingAddress = await Address.findById(addressId);
    if (!existingAddress) {
      return res.status(404).json({ success: false, message: "Address not found!" });
    }

    if (existingAddress.isDefault) {
      return res.status(400).json({ success: false, message: "Cannot delete default address" });
    }

    await existingAddress.deleteOne();
    res.status(200).json({
      success: true,
      message: "Address deleted successfully!",
    });

  } catch (error) {
    next(error);
  }
});
