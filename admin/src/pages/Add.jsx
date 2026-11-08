import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import {
  FiUploadCloud,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiCheckCircle,
  FiStar,
  FiImage,
  FiPlus,
  FiX,
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
  const [loading, setLoading] = useState(false);

  const availableSubCategories = CATEGORY_SUBCATEGORIES[category] || [];

  const showSizes = ["Men", "Women", "Kids", "Footwear"].includes(category);

  const sizeOptions =
    category === "Footwear"
      ? ["6", "7", "8", "9", "10", "11", "12"]
      : ["S", "M", "L", "XL", "XXL"];

  const images = [image1, image2, image3, image4];
  const setImages = [setImage1, setImage2, setImage3, setImage4];

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setcategory(selectedCategory);

    const types = CATEGORY_SUBCATEGORIES[selectedCategory] || [];
    setsubCategory(types[0] || "");
    setSizes([]);
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size],
    );
  };

  const handleImageChange = (e, imageNumber) => {
    const file = e.target.files[0];
    if (!file) return;

    setImages[imageNumber - 1](file);
  };

  const removeImage = (imageNumber) => {
    setImages[imageNumber - 1](false);
  };

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
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image1 && !image2 && !image3 && !image4) {
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

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("inStock", String(inStock));
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", String(bestseller));
      formData.append("Sizes", JSON.stringify(Sizes));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        {
          headers: { token },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <label
                    htmlFor={`image${index + 1}`}
                    className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all ${
                      img
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-slate-200 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
                    }`}
                  >
                    {img ? (
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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
                      onChange={(e) => handleImageChange(e, index + 1)}
                    />
                  </label>

                  {img && (
                    <button
                      type="button"
                      onClick={() => removeImage(index + 1)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white text-red-500 shadow-md flex items-center justify-center hover:bg-red-50 transition"
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
