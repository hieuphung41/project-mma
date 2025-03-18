import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import asyncHandler from "./async.midleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/products"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});

const productImageResize = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  // await Promise.all(
  //   req.files.map(async (file) => {
  //     const outputFilePath = `public/images/products/resized-${file.filename}`;

  //     await sharp(file.path)
  //       .resize(300, 300)
  //       .toFormat("jpeg")
  //       .jpeg({ quality: 90 })
  //       .toFile(outputFilePath);

  //     fs.unlink(file.path, (err) => {
  //       if (err) console.error("Error deleting original file:", err);
  //     });

  //     file.path = outputFilePath;
  //   })
  // );

  await Promise.all(
    req.files.map(async (file) => {
      if (!fs.existsSync(file.path)) return;

      console.log(`Image saved: ${file.path}`);
    })
  );

  next();
});

export { uploadPhoto, productImageResize };
