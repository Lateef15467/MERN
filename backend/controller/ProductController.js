import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Upload one image to Cloudinary
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "BaltiMart/products",
    });

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log("Image upload error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
};

// Add product using already-uploaded Cloudinary image URLs
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      Sizes,
      bestseller,
      inStock,
      imageUrls,
    } = req.body;

    const images =
      typeof imageUrls === "string" ? JSON.parse(imageUrls) : imageUrls;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one product image",
      });
    }

    const parsedSizes = typeof Sizes === "string" ? JSON.parse(Sizes) : Sizes;

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      Sizes: Array.isArray(parsedSizes) ? parsedSizes : [],
      bestseller:
        typeof bestseller === "string"
          ? bestseller.toLowerCase() === "true"
          : Boolean(bestseller),
      inStock:
        typeof inStock === "string"
          ? inStock.toLowerCase() === "true"
          : Boolean(inStock),
      image: images,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log("Add product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add product",
    });
  }
};

// List all products
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    return res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);

    return res.json({
      success: true,
      message: "Product removed",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single product using request body
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    return res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({ success: true, product });
  } catch (error) {
    console.log("getProductById error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      category,
      subCategory,
      bestseller,
      Sizes,
      inStock,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (subCategory !== undefined) product.subCategory = subCategory;

    if (bestseller !== undefined) {
      product.bestseller =
        typeof bestseller === "string"
          ? bestseller.toLowerCase() === "true"
          : Boolean(bestseller);
    }

    if (inStock !== undefined) {
      product.inStock =
        typeof inStock === "string"
          ? inStock.toLowerCase() === "true"
          : Boolean(inStock);
    }

    if (Sizes !== undefined) {
      try {
        product.Sizes = typeof Sizes === "string" ? JSON.parse(Sizes) : Sizes;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid Sizes format",
        });
      }
    }

    let images = Array.isArray(product.image) ? [...product.image] : [];

    const files = req.files || {};

    for (let i = 1; i <= 4; i++) {
      const field = `image${i}`;

      if (files[field] && files[field][0]) {
        const file = files[field][0];

        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
          folder: "BaltiMart/products",
        });

        images[i - 1] = result.secure_url;
      } else if (req.body[`removeImage${i}`] === "true") {
        images[i - 1] = undefined;
      }
    }

    product.image = images.filter((url) => url !== undefined && url !== null);

    await product.save();

    return res.json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    console.log("updateProduct error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark product as in stock
const stockIn = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.inStock = true;
    await product.save();

    return res.json({
      success: true,
      message: "Product marked as in stock",
      inStock: product.inStock,
    });
  } catch (error) {
    console.log("stockIn error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark product as out of stock
const stockOut = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.inStock = false;
    await product.save();

    return res.json({
      success: true,
      message: "Product marked as out of stock",
      inStock: product.inStock,
    });
  } catch (error) {
    console.log("stockOut error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  listProduct,
  addProduct,
  removeProduct,
  singleProduct,
  getProductById,
  updateProduct,
  stockIn,
  stockOut,
  uploadProductImage,
};
