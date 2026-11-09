import React, { useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import {
  FiUploadCloud,
  FiPackage,
  FiTag,
  FiCheckCircle,
  FiStar,
  FiImage,
  FiPlus,
  FiX,
  FiCheck,
} from "react-icons/fi";

// Category and related product types
const CATEGORY_SUBCATEGORIES = {
  Men: ["Topwear", "Bottomwear", "Winterwear"],
  Women: ["Topwear", "Bottomwear", "Winterwear"],
  Kids: ["Topwear", "Bottomwear", "Winterwear"],
  Electronics: ["Laptops", "Headphones", "Accessories"],
  "Mobile & Accessories": ["Smartphones", "Accessories"],
  "Home & Living": ["Home Decor"],
  Furniture: ["Furniture"],
  "Beauty & Personal Care": ["Skincare", "Makeup"],
  Footwear: ["Shoes"],
  "Bags & Accessories": ["Bags", "Accessories"],
  "Sports & Outdoors": ["Sports Equipment"],
  "Kitchen & Dining": ["Kitchen Appliances"],
  Grocery: ["Food & Beverages"],
  Watches: ["Watches"],
  "Toys & Games": ["Toys"],
  "Books & Stationery": ["Books & Stationery", "Stationery"],
  Automotive: ["Automotive Accessories"],
};

const Add = ({ token }) => {
  // Images
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  // Product details
  const [name, setname] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState("");

  // Category and product type
  const [category, setcategory] = useState("Men");
  const [subCategory, setsubCategory] = useState("Topwear");

  // Other options
  const [inStock, setInStock] = useState(false);
  const [bestseller, setbestseller] = useState(false);
  const [Sizes, setSizes] = useState([]);

  // Individual image upload states
  const [loading, setLoading] = useState(false);
  const [imageProgress, setImageProgress] = useState([0, 0, 0, 0]);
  const [imageStatus, setImageStatus] = useState([
    "idle",
    "idle",
    "idle",
    "idle",
  ]);

  const availableSubCategories = CATEGORY_SUBCATEGORIES[category] || [];

  const showSizes = ["Men", "Women", "Kids", "Footwear"].includes(category);

  const sizeOptions =
    category === "Footwear"
      ? ["6", "7", "8", "9", "10", "11", "12"]
      : ["S", "M", "L", "XL", "XXL"];

  const images = [image1, image2, image3, image4];

  const setImages = [setImage1, setImage2, setImage3, setImage4];

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    setcategory(selectedCategory);

    const types = CATEGORY_SUBCATEGORIES[selectedCategory] || [];

    setsubCategory(types[0] || "");
    setSizes([]);
  };

  // Handle size selection
  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size],
    );
  };

  // Handle image selection
  const handleImageChange = (e, imageNumber) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      e.target.value = "";
      return;
    }

    const index = imageNumber - 1;

    setImages[index](file);

    setImageProgress((prev) =>
      prev.map((value, i) => (i === index ? 0 : value)),
    );

    setImageStatus((prev) =>
      prev.map((status, i) => (i === index ? "idle" : status)),
    );

    e.target.value = "";
  };

  // Remove selected image
  const removeImage = (imageNumber) => {
    const index = imageNumber - 1;

    setImages[index](false);

    setImageProgress((prev) =>
      prev.map((value, i) => (i === index ? 0 : value)),
    );

    setImageStatus((prev) =>
      prev.map((status, i) => (i === index ? "idle" : status)),
    );
  };

  // Reset form
  const resetForm = () => {
    setname("");
    setdescription("");
    setprice("");

    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);

    setcategory("Men");
    setsubCategory("Topwear");

    setInStock(false);
    setbestseller(false);
    setSizes([]);

    setImageProgress([0, 0, 0, 0]);
    setImageStatus(["idle", "idle", "idle", "idle"]);
  };

  // Submit product and upload images individually
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter product name");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter product description");
      return;
    }

    if (!images.some(Boolean)) {
      toast.error("Please upload at least one product image");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid product price");
      return;
    }

    if (!subCategory) {
      toast.error("Please select a product type");
      return;
    }

    if (!token) {
      toast.error("Admin authentication token is missing");
      return;
    }

    setLoading(true);
    setImageProgress([0, 0, 0, 0]);
    setImageStatus(["idle", "idle", "idle", "idle"]);

    let currentImageIndex = -1;

    try {
      const uploadedImageUrls = [];

      // Upload selected images one by one
      for (let index = 0; index < images.length; index++) {
        const file = images[index];

        if (!file) continue;

        currentImageIndex = index;

        setImageStatus((prev) =>
          prev.map((status, i) => (i === index ? "uploading" : status)),
        );

        const formData = new FormData();

        formData.append("image", file);

        const response = await axios.post(
          backendUrl + "/api/product/upload-image",
          formData,
          {
            headers: {
              token,
            },

            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentage = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total,
                );

                setImageProgress((prev) =>
                  prev.map((value, i) => (i === index ? percentage : value)),
                );
              }
            },
          },
        );

        if (!response.data.success || !response.data.imageUrl) {
          throw new Error(
            response.data.message || `Image ${index + 1} upload failed`,
          );
        }

        uploadedImageUrls.push(response.data.imageUrl);

        // Mark image as uploaded
        setImageProgress((prev) =>
          prev.map((value, i) => (i === index ? 100 : value)),
        );

        setImageStatus((prev) =>
          prev.map((status, i) => (i === index ? "uploaded" : status)),
        );

        currentImageIndex = -1;
      }

      // Product data
      const productData = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        inStock,
        category,
        subCategory,
        bestseller,
        Sizes,
        imageUrls: uploadedImageUrls,
      };

      // Save product after successful image uploads
      const response = await axios.post(
        backendUrl + "/api/product/add",
        productData,
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add product");
      }

      toast.success(response.data.message || "Product added successfully");

      resetForm();
    } catch (error) {
      console.log("Product upload error:", error);

      // Mark the failed image
      if (currentImageIndex !== -1) {
        setImageStatus((prev) =>
          prev.map((status, i) => (i === currentImageIndex ? "error" : status)),
        );
      }

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full mt-2 px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";

  const labelClass = "block text-sm font-semibold text-slate-700";

  return (
    <div className="w-full max-w-6xl mx-auto pb-10">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <span>Products</span>
            <span>/</span>
            <span className="text-indigo-600 font-medium">Add Product</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Add New Product
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Create a product listing for your BaltiMart store.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl text-sm font-medium w-fit">
          <FiPackage size={18} />
          Product Management
        </div>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-6">
        {/* Image upload section */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FiImage size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">Product Images</h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Upload up to four images. At least one image is required.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {/* Image selection summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Images Selected
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {images.filter(Boolean).length} of 4 images selected
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${(images.filter(Boolean).length / 4) * 100}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-emerald-600">
                  {images.filter(Boolean).length}/4
                </span>
              </div>
            </div>

            {/* Individual image upload cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <label
                    htmlFor={`image${index + 1}`}
                    className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all ${
                      img
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
                    }`}
                  >
                    {img ? (
                      <>
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Individual upload status */}
                        {imageStatus[index] !== "idle" && (
                          <div
                            className={`absolute bottom-0 left-0 right-0 text-white py-2 px-2 flex flex-col items-center justify-center gap-1 text-xs font-semibold ${
                              imageStatus[index] === "uploaded"
                                ? "bg-emerald-600"
                                : imageStatus[index] === "error"
                                  ? "bg-red-600"
                                  : "bg-indigo-600"
                            }`}
                          >
                            {imageStatus[index] === "uploaded" ? (
                              <span className="flex items-center gap-1">
                                <FiCheck size={14} />
                                Uploaded
                              </span>
                            ) : imageStatus[index] === "error" ? (
                              <span>Upload Failed</span>
                            ) : (
                              <>
                                <span>Uploading {imageProgress[index]}%</span>

                                <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-white rounded-full transition-all duration-200"
                                    style={{
                                      width: `${imageProgress[index]}%`,
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-center p-3">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 mb-3">
                          <FiUploadCloud size={23} />
                        </div>

                        <span className="text-sm font-semibold text-slate-600">
                          Upload Image
                        </span>

                        <span className="text-xs text-slate-400 mt-1">
                          Image {index + 1}
                        </span>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      id={`image${index + 1}`}
                      disabled={loading}
                      onChange={(e) => handleImageChange(e, index + 1)}
                    />
                  </label>

                  {/* Remove image button */}
                  {img && (
                    <button
                      type="button"
                      onClick={() => removeImage(index + 1)}
                      disabled={loading}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white text-red-500 shadow-md flex items-center justify-center hover:bg-red-50 transition disabled:opacity-50"
                      title="Remove image"
                    >
                      <FiX size={17} />
                    </button>
                  )}

                  <p className="text-center text-xs text-slate-400 mt-2">
                    Image {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Basic information */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiPackage size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">Basic Information</h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Enter the product name and description.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-5">
            <div>
              <label className={labelClass}>Product Name</label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setname(e.target.value)}
                placeholder="e.g. Premium Winter Jacket"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Product Description</label>

              <textarea
                required
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                placeholder="Describe your product, its features and details..."
                rows={5}
                className={`${inputClass} resize-y min-h-32`}
              />
            </div>
          </div>
        </section>

        {/* Category and pricing */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FiTag size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">Category & Pricing</h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Organize your product and set its selling price.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className={labelClass}>Category</label>

              <select
                required
                value={category}
                onChange={handleCategoryChange}
                className={inputClass}
              >
                {Object.keys(CATEGORY_SUBCATEGORIES).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Product Type</label>

              <select
                required
                value={subCategory}
                onChange={(e) => setsubCategory(e.target.value)}
                className={inputClass}
              >
                {availableSubCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Product Price</label>

              <div className="relative">
                <span className="absolute left-4 top-[25px] -translate-y-1/2 text-slate-500 text-sm font-semibold">
                  {currency}
                </span>

                <input
                  type="number"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => setprice(e.target.value)}
                  placeholder="0"
                  className={`${inputClass} pl-14`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Inventory and options */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiCheckCircle size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">Inventory & Options</h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Manage availability, sizes and product highlights.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-7">
            {/* Stock status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Stock Availability
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Set whether customers can currently purchase this product.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInStock(!inStock)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  inStock ? "bg-emerald-500" : "bg-slate-300"
                }`}
                aria-label="Toggle stock availability"
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    inStock ? "left-8" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  inStock ? "bg-emerald-500" : "bg-red-400"
                }`}
              />

              <span className="text-sm text-slate-600">
                Current status:{" "}
                <strong
                  className={inStock ? "text-emerald-600" : "text-red-500"}
                >
                  {inStock ? "In Stock" : "Out of Stock"}
                </strong>
              </span>
            </div>

            {/* Sizes */}
            {showSizes && (
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  Available Sizes
                </h3>

                <p className="text-xs text-slate-500 mb-4">
                  Select all sizes available for this product.
                </p>

                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`min-w-12 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        Sizes.includes(size)
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bestseller */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <FiStar size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Mark as Bestseller
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Highlight this product as a popular item.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bestseller}
                  onChange={() => setbestseller(!bestseller)}
                  className="sr-only peer"
                />

                <div className="w-12 h-6 bg-slate-300 rounded-full peer peer-checked:bg-amber-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-all peer-checked:after:translate-x-6" />
              </label>
            </div>
          </div>
        </section>

        {/* Submit actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="px-6 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
          >
            Reset Form
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding Product...
              </>
            ) : (
              <>
                <FiPlus size={19} />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
