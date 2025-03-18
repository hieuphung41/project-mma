import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../config/env.js'
import User from '../models/user.model.js'
import asyncHandler from './async.midleware.js'

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized - token invalid");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized - no token");
  }
});

const authorizeAdmin = (req, res, next) => {
  
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as admin");
  }
};
const authorizeSaleStaff = (req, res, next) => {
  
  if (req.user && req.user.role === 'sale-staff') {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as sale-staff");
  }
};


export {authenticate, authorizeAdmin, authorizeSaleStaff}