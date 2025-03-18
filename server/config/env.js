import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT = 5500,
  NODE_ENV,
  DB_URI = "mongodb+srv://sdn:sdn@cluster0.psngf.mongodb.net/",
  JWT_SECRET = "AVT",
  JWT_EXPIRES_IN = "1d",
  JWT_REFRESH_EXPIRES_IN = "7d",
  EMAIL_PASSWORD,
  EMAIL_ACCOUNT,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
  VNP_TMN_CODE,
  VNP_HASH_SECRET,
  VNP_URL,
  VNP_RETURN_URL,
  VNP_API_URL,
} = process.env;
