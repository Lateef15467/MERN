import express from "express";

import {
  listProduct,
  addProduct,
  uploadProductImage,
  removeProduct,
  singleProduct,
  getProductById,
  updateProduct,
  stockIn,
  stockOut,
} from "../controller/ProductController.js";

import upload from "../middleware/Multer.js";
import adminAuth from "../middleware/adminAuth.js";
import vendorAuth from "../middleware/vendorAuth.js";

const productRouter = express.Router();

// Upload individual product image to Cloudinary
productRouter.post(
  "/upload-image",
  vendorAuth,
  upload.single("image"),
  uploadProductImage,
);

// Add product using uploaded Cloudinary image URLs
productRouter.post("/add", vendorAuth, addProduct);

// Remove product
productRouter.post("/remove", vendorAuth, removeProduct);

// Get single product
productRouter.post("/single", singleProduct);

// Get all products
productRouter.get("/list", listProduct);

// Stock management
productRouter.post("/stock-in/:id", adminAuth, stockIn);
productRouter.post("/stock-out/:id", adminAuth, stockOut);

// Update product
productRouter.put(
  "/update/:id",
  vendorAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct,
);

// Get product by ID (keep this last)
productRouter.get("/:id", getProductById);

export default productRouter;
