import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../middlewares/async.midleware.js";
import crypto from "crypto";
import transporter from "../config/nodemailer.js"
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from "../config/env.js";
import jwt from "jsonwebtoken";

export const signUp = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const verificationCode = crypto.randomBytes(3).toString("hex").toUpperCase(); 

    const newUser = new User({
      name,
      email,
      password, 
      role,
      phone,
      isVerified: false,
      verificationCode,
    });

    await newUser.save();

    const mailOptions = {
      from: process.env.EMAIL_ACCOUNT,
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Verification code sent to your email. Please verify your email before logging in.",
    });
  } catch (error) {
    next(error);
  }
});

export const signIn = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    generateToken(res, user._id);
    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const signOut = asyncHandler(async (req, res, next) => {
  try {
    res.cookie("jwt", "", {
      httyOnly: true,
      expires: new Date(0),
    });
    res.cookie("refreshJwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  try {
    const { email, verificationCode, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ success: false, message: "Invalid verification code" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.isVerified = true;
    user.verificationCode = null; 

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshJwt } = req.cookies;

  if (!refreshJwt) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshJwt, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 24*60*60*1000,
    });

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});