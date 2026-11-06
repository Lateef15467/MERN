import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

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

  // Get product types according to selected category
  const availableSubCategories = CATEGORY_SUBCATEGORIES[category] || [];

  // Determine whether sizes are needed
  const showSizes = ["Men", "Women", "Kids", "Footwear"].includes(category);

  // Size options
  const sizeOptions =
    category === "Footwear"
      ? ["6", "7", "8", "9", "10", "11", "12"]
      : ["S", "M", "L", "XL", "XXL"];

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    setcategory(selectedCategory);

    // Automatically select the first product type
    const types = CATEGORY_SUBCATEGORIES[selectedCategory] || [];
    setsubCategory(types[0] || "");

    // Reset sizes
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

    if (imageNumber === 1) setImage1(file);
    if (imageNumber === 2) setImage2(file);
    if (imageNumber === 3) setImage3(file);
    if (imageNumber === 4) setImage4(file);
  };

  // Reset form after successful submission
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

  // Submit product
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

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-full max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-2xl border border-gray-100 animate-fadeIn flex flex-col gap-7"
    >
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 tracking-wide">
          Add New Product
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Fill in the details below to list a new product.
        </p>
      </div>

      {/* Upload Images */}
      <div>
        <p className="mb-3 font-semibold text-gray-700">Upload Images</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[image1, image2, image3, image4].map((img, index) => (
            <label
              key={index}
              htmlFor={`image${index + 1}`}
              className="group cursor-pointer"
            >
              <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 h-28 flex items-center justify-center shadow-sm group-hover:border-black transition relative">
                <img
                  className="w-full h-full object-cover rounded-xl"
                  src={!img ? assets.upload_area : URL.createObjectURL(img)}
                  alt="Product upload"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                hidden
                id={`image${index + 1}`}
                onChange={(e) => handleImageChange(e, index + 1)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div>
        <label className="font-medium text-gray-700">Product Name</label>

        <input
          type="text"
          required
          value={name}
          onChange={(e) => setname(e.target.value)}
          placeholder="Enter product name"
          className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-black outline-none shadow-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="font-medium text-gray-700">Product Description</label>

        <textarea
          required
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          placeholder="Write a detailed description..."
          className="w-full mt-1 px-4 py-3 h-32 rounded-xl border border-gray-300 bg-gray-50 outline-none shadow-sm focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Category, Product Type and Price */}
      <div className="grid sm:grid-cols-3 gap-6">
        {/* Category */}
        <div>
          <label className="font-medium text-gray-700">Category</label>

          <select
            required
            value={category}
            onChange={handleCategoryChange}
            className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 shadow-sm focus:ring-2 focus:ring-black outline-none"
          >
            {Object.keys(CATEGORY_SUBCATEGORIES).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Product Type */}
        <div>
          <label className="font-medium text-gray-700">Product Type</label>

          <select
            required
            value={subCategory}
            onChange={(e) => setsubCategory(e.target.value)}
            className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 shadow-sm focus:ring-2 focus:ring-black outline-none"
          >
            {availableSubCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="font-medium text-gray-700">Price</label>

          <input
            type="number"
            min="1"
            required
            value={price}
            onChange={(e) => setprice(e.target.value)}
            placeholder="0"
            className="w-full mt-1 px-4 py-3 rounded-xl border bg-gray-50 shadow-sm focus:ring-2 focus:ring-black outline-none"
          />
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={inStock}
          onChange={() => setInStock(!inStock)}
          className="w-4 h-4 accent-black"
        />

        <label className="font-medium text-gray-700">
          {inStock ? "In Stock" : "Out of Stock"}
        </label>
      </div>

      {/* Available Sizes */}
      {showSizes && (
        <div>
          <p className="mb-3 font-semibold text-gray-700">Available Sizes</p>

          <div className="flex gap-3 flex-wrap">
            {sizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-5 py-2 rounded-xl border shadow-sm transition ${
                  Sizes.includes(size)
                    ? "bg-black text-white border-black"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bestseller */}
      <div className="flex items-center gap-3 mt-1">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setbestseller(!bestseller)}
          className="w-5 h-5 cursor-pointer accent-black"
        />

        <label
          htmlFor="bestseller"
          className="cursor-pointer font-medium text-gray-700"
        >
          Mark as Bestseller
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`mt-2 flex items-center justify-center gap-2 py-3 rounded-xl shadow-md transition text-lg font-semibold ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-900"
        }`}
      >
        {loading && (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}

        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default Add;
