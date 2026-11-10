import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiUploadCloud,
  FiPackage,
  FiTag,
  FiCheckCircle,
  FiStar,
  FiImage,
  FiX,
  FiCheck,
  FiArrowLeft,
  FiLoader,
} from "react-icons/fi";
import { backendUrl, currency } from "../App";

// Categories and subcategories
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

const EditProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Images: existing URLs or newly selected files
  const [images, setImages] = useState([null, null, null, null]);

  // Image previews
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);

  // Product details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  // Category and product type
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");

  // Product options
  const [inStock, setInStock] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [Sizes, setSizes] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Individual image upload progress and status
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

  const selectedCount = images.filter(Boolean).length;

  const isUploading = imageStatus.some((status) => status === "uploading");

  // Create previews without repeatedly generating object URLs
  useEffect(() => {
    const previews = images.map((item) => {
      if (!item) return null;

      if (typeof item === "string") {
        return item;
      }

      return URL.createObjectURL(item);
    });

    setImagePreviews(previews);

    return () => {
      previews.forEach((url, index) => {
        if (url && images[index] && typeof images[index] !== "string") {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  // Apply fetched product details
  const applyProductToState = (product) => {
    setName(product.name || "");
    setDescription(product.description || "");
    setPrice(product.price ?? "");

    setInStock(Boolean(product.inStock));
    setCategory(product.category || "Men");
    setBestseller(Boolean(product.bestseller));

    const selectedCategory = product.category || "Men";

    const subcategories = CATEGORY_SUBCATEGORIES[selectedCategory] || [];

    setSubCategory(
      subcategories.includes(product.subCategory)
        ? product.subCategory
        : subcategories[0] || "",
    );

    setSizes(Array.isArray(product.Sizes) ? product.Sizes : []);

    const fetchedImages = Array.isArray(product.image) ? product.image : [];

    const imageArray = [null, null, null, null];

    for (let i = 0; i < Math.min(fetchedImages.length, 4); i++) {
      imageArray[i] = fetchedImages[i];
    }

    setImages(imageArray);
  };

  // Fetch product details
  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setFetching(true);

      try {
        let response;

        try {
          response = await axios.get(`${backendUrl}/api/product/${id}`);
        } catch (error) {
          if (error.response?.status !== 404) {
            throw error;
          }

          response = await axios.post(`${backendUrl}/api/product/single`, {
            productId: id,
          });
        }

        if (!isMounted) return;

        if (response.data?.success && response.data?.product) {
          applyProductToState(response.data.product);
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        console.error("Fetch product error:", error);

        if (isMounted) {
          toast.error(error.response?.data?.message || "Error loading product");
        }
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Category change
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    setCategory(selectedCategory);

    const types = CATEGORY_SUBCATEGORIES[selectedCategory] || [];

    setSubCategory(types[0] || "");
    setSizes([]);
  };

  // Size selection
  const toggleSize = (size) => {
    setSizes((previous) =>
      previous.includes(size)
        ? previous.filter((item) => item !== size)
        : [...previous, size],
    );
  };

  // Immediately upload selected image
  const handleImageChange = async (e, index) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      e.target.value = "";
      return;
    }

    if (!token) {
      toast.error("Admin authentication token is missing");
      e.target.value = "";
      return;
    }

    // Show selected image immediately
    setImages((previous) => {
      const updated = [...previous];
      updated[index] = file;
      return updated;
    });

    // Start upload status
    setImageProgress((previous) =>
      previous.map((value, i) => (i === index ? 0 : value)),
    );

    setImageStatus((previous) =>
      previous.map((status, i) => (i === index ? "uploading" : status)),
    );

    // Reset input to allow selecting the same file again
    e.target.value = "";

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${backendUrl}/api/product/upload-image`,
        formData,
        {
          headers: {
            token,
          },

          onUploadProgress: (event) => {
            if (event.total) {
              const percentage = Math.round((event.loaded * 100) / event.total);

              setImageProgress((previous) =>
                previous.map((value, i) => (i === index ? percentage : value)),
              );
            }
          },
        },
      );

      if (!response.data?.success || !response.data?.imageUrl) {
        throw new Error(
          response.data?.message || `Image ${index + 1} upload failed`,
        );
      }

      // Replace File with uploaded Cloudinary URL
      setImages((previous) => {
        const updated = [...previous];
        updated[index] = response.data.imageUrl;
        return updated;
      });

      setImageProgress((previous) =>
        previous.map((value, i) => (i === index ? 100 : value)),
      );

      setImageStatus((previous) =>
        previous.map((status, i) => (i === index ? "uploaded" : status)),
      );

      // No success toast for image upload
    } catch (error) {
      console.error("Image upload error:", error);

      setImageStatus((previous) =>
        previous.map((status, i) => (i === index ? "error" : status)),
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          `Image ${index + 1} upload failed`,
      );
    }
  };

  // Remove image
  const removeImage = (index) => {
    if (imageStatus[index] === "uploading") {
      return;
    }

    setImages((previous) => {
      const updated = [...previous];
      updated[index] = null;
      return updated;
    });

    setImageProgress((previous) =>
      previous.map((value, i) => (i === index ? 0 : value)),
    );

    setImageStatus((previous) =>
      previous.map((status, i) => (i === index ? "idle" : status)),
    );
  };

  // Update product
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter product name");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter product description");
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

    if (!images.some(Boolean)) {
      toast.error("Please keep at least one product image");
      return;
    }

    // Prevent update while image uploads are running
    if (isUploading) {
      toast.warning("Please wait for image uploads to finish");
      return;
    }

    // Every selected file must have uploaded successfully
    const failedUpload = images.some(
      (item) => item && typeof item !== "string",
    );

    if (failedUpload) {
      toast.error("Some images are not uploaded. Please select them again.");
      return;
    }

    if (!token) {
      toast.error("Admin authentication token is missing");
      return;
    }

    setLoading(true);

    try {
      // Keep existing and newly uploaded Cloudinary URLs
      const finalImages = images.filter(
        (image) => typeof image === "string" && image.length > 0,
      );

      const productData = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        inStock,
        category,
        subCategory,
        bestseller,
        Sizes,
        imageUrls: finalImages,
      };

      // Only update product details. No image upload here.
      const response = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        productData,
        {
          headers: {
            token,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Product update failed");
      }

      toast.success(response.data.message || "Product updated successfully");

      navigate("/list");
    } catch (error) {
      console.error("Product update error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error updating product",
      );
    } finally {
      setLoading(false);
    }
  };

  // Input styles
  const inputClass =
    "w-full mt-2 px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";

  const labelClass = "block text-sm font-semibold text-slate-700";

  // Loading page
  if (fetching) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <FiLoader className="animate-spin text-3xl text-indigo-600" />
        <p className="text-sm text-gray-500">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-3"
          >
            <FiArrowLeft />
            Back to Products
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <span>Products</span>
            <span>/</span>
            <span className="text-indigo-600 font-medium">Edit Product</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Edit Product
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Update product details, images, pricing and inventory.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl text-sm font-medium w-fit">
          <FiPackage size={18} />
          Product Management
        </div>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        {/* Product Images */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FiImage size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">Product Images</h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Keep, replace or remove images. Up to four images.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {/* Image summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Images Selected
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {selectedCount} of 4 images selected
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${(selectedCount / 4) * 100}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-emerald-600">
                  {selectedCount}/4
                </span>
              </div>
            </div>

            {/* Image cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <label
                    htmlFor={`edit-image-${index}`}
                    className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all ${
                      img
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
                    }`}
                  >
                    {img ? (
                      <>
                        <img
                          src={imagePreviews[index]}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Upload status */}
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
                                Uploaded Successfully
                              </span>
                            ) : imageStatus[index] === "error" ? (
                              <span>Upload Failed - Select Again</span>
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
                      id={`edit-image-${index}`}
                      disabled={loading || imageStatus[index] === "uploading"}
                      onChange={(e) => handleImageChange(e, index)}
                    />
                  </label>

                  {/* Remove image */}
                  {img && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={loading || imageStatus[index] === "uploading"}
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

            <div className="mt-5 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> Existing images are kept automatically.
                New images upload to Cloudinary immediately after selection.
                Wait until uploads finish before updating the product.
              </p>
            </div>
          </div>
        </section>

        {/* Basic Information */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiPackage size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">Basic Information</h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Update product name and description.
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
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Product Description</label>

              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product, its features and details..."
                className={`${inputClass} resize-y min-h-32`}
              />
            </div>
          </div>
        </section>

        {/* Category and Pricing */}
        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FiTag size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">Category & Pricing</h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Organize your product and update its selling price.
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
                onChange={(e) => setSubCategory(e.target.value)}
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
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className={`${inputClass} pl-14`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Inventory and Options */}
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
            {/* Stock availability */}
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
                  onChange={() => setBestseller(!bestseller)}
                  className="sr-only peer"
                />

                <div className="w-12 h-6 bg-slate-300 rounded-full peer peer-checked:bg-amber-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:shadow after:transition-all peer-checked:after:translate-x-6" />
              </label>
            </div>
          </div>
        </section>

        {/* Submit buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/list")}
            disabled={loading}
            className="px-6 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || isUploading}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading || isUploading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isUploading ? "Uploading Images..." : "Updating Product..."}
              </>
            ) : (
              <>
                <FiCheck size={19} />
                Update Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
