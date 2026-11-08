import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiUploadCloud,
  FiPackage,
  FiTag,
  FiDollarSign,
  FiCheck,
  FiArrowLeft,
  FiStar,
  FiLayers,
  FiLoader,
} from "react-icons/fi";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";

const EditProduct = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setsubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [Sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [inStock, setInStock] = useState(false);

  const preview = (item) => {
    if (!item) return assets.upload_area;
    if (typeof item === "string") return item;
    return URL.createObjectURL(item);
  };

  useEffect(() => {
    const applyProductToState = (p) => {
      setName(p.name || "");
      setDescription(p.description || "");
      setPrice(p.price ?? "");
      setInStock(Boolean(p.inStock));
      setCategory(p.category || "Men");
      setsubCategory(p.subCategory || "Topwear");
      setBestseller(Boolean(p.bestseller));
      setSizes(Array.isArray(p.Sizes) ? p.Sizes : []);

      const fetchedImages = Array.isArray(p.image) ? p.image : [];
      const temp = [null, null, null, null];

      for (let i = 0; i < Math.min(fetchedImages.length, 4); i++) {
        temp[i] = fetchedImages[i];
      }

      setImages(temp);
    };

    const fetchProduct = async () => {
      setFetching(true);

      try {
        const res = await axios.get(`${backendUrl}/api/product/${id}`);

        if (res.data?.success) {
          applyProductToState(res.data.product);
          return;
        }

        toast.error("Product not found");
      } catch (err) {
        if (err.response?.status === 404) {
          try {
            const res2 = await axios.post(`${backendUrl}/api/product/single`, {
              productId: id,
            });

            if (res2.data?.success) {
              applyProductToState(res2.data.product);
            } else {
              toast.error("Product not found");
            }
          } catch {
            toast.error("Failed to load product");
          }
        } else {
          toast.error("Error loading product");
        }
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageChange = (e, index) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const copy = [...images];
    copy[index] = file;
    setImages(copy);

    e.target.value = "";
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      form.append("name", name);
      form.append("description", description);
      form.append("price", price);
      form.append("inStock", String(inStock));
      form.append("category", category);
      form.append("subCategory", subCategory);
      form.append("bestseller", String(bestseller));
      form.append("Sizes", JSON.stringify(Sizes));

      images.forEach((img, idx) => {
        if (img instanceof File) {
          form.append(`image${idx + 1}`, img);
        }
      });

      const res = await axios.put(
        `${backendUrl}/api/product/update/${id}`,
        form,
        {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.data?.success) {
        toast.success("Product updated successfully");
        navigate("/list");
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <FiLoader className="animate-spin text-3xl text-gray-700" />
        <p className="text-sm text-gray-500">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-3 transition"
          >
            <FiArrowLeft />
            Back to Products
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Edit Product
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Update product details, images, pricing and inventory.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl w-fit">
          <FiPackage />
          <span className="text-sm font-medium">Product Management</span>
        </div>
      </div>

      <form onSubmit={submitHandler} className="space-y-6">
        {/* Images Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
              <FiUploadCloud size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">Product Images</h2>
              <p className="text-xs text-gray-500">
                Upload up to 4 product images
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <label key={i} className="relative group cursor-pointer">
                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden group-hover:border-gray-500 transition">
                  <img
                    src={preview(img)}
                    alt={`Product ${i + 1}`}
                    className="w-full h-full object-contain p-2"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white">
                    <FiUploadCloud size={24} />
                    <span className="text-xs mt-2 font-medium">
                      Change Image
                    </span>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-500 mt-2">
                  Image {i + 1}
                </p>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageChange(e, i)}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-purple-50 text-purple-600 p-2.5 rounded-xl">
              <FiPackage size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">Basic Information</h2>
              <p className="text-xs text-gray-500">
                Product name and description
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description *
              </label>

              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write product description..."
                className="w-full p-3 border border-gray-200 rounded-xl outline-none resize-y focus:border-black focus:ring-1 focus:ring-black transition"
              />
            </div>
          </div>
        </div>

        {/* Pricing and Categories */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-green-50 text-green-600 p-2.5 rounded-xl">
              <FiTag size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Pricing & Categories
              </h2>
              <p className="text-xs text-gray-500">
                Set product price and classification
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>

              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl outline-none focus:border-black transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-black bg-white"
              >
                <option>Men</option>
                <option>Women</option>
                <option>Kids</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Category
              </label>

              <select
                value={subCategory}
                onChange={(e) => setsubCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-black bg-white"
              >
                <option>Topwear</option>
                <option>Bottomwear</option>
                <option>Winterwear</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-orange-50 text-orange-600 p-2.5 rounded-xl">
              <FiLayers size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Inventory & Options
              </h2>
              <p className="text-xs text-gray-500">
                Manage availability and product sizes
              </p>
            </div>
          </div>

          {/* Stock */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 mb-5">
            <div>
              <p className="font-medium text-sm text-gray-800">
                Stock Availability
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Control whether customers can purchase this product.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setInStock(!inStock)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                inStock ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                  inStock ? "left-8" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Available Sizes
            </p>

            <div className="flex flex-wrap gap-3">
              {["S", "M", "L", "XL", "XXL"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setSizes((prev) =>
                      prev.includes(s)
                        ? prev.filter((x) => x !== s)
                        : [...prev, s],
                    )
                  }
                  className={`min-w-12 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                    Sizes.includes(s)
                      ? "bg-black text-white border-black"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Bestseller */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                <FiStar size={18} />
              </div>

              <div>
                <p className="font-medium text-sm text-gray-800">
                  Bestseller Product
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Highlight this product as a bestseller.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={bestseller}
              onChange={() => setBestseller(!bestseller)}
              className="w-5 h-5 accent-black cursor-pointer"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Updating Product...
              </>
            ) : (
              <>
                <FiCheck />
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
