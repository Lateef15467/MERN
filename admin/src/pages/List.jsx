import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

import {
  FiSearch,
  FiPackage,
  FiEdit2,
  FiTrash2,
  FiX,
  FiAlertTriangle,
  FiRefreshCw,
  FiPlus,
  FiFilter,
  FiTag,
  FiLayers,
  FiDollarSign,
} from "react-icons/fi";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showWarning, setShowWarning] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // Fetch products
  const fetchList = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${backendUrl}/api/product/list`);

      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error(response.data.message || "Unable to fetch products");
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Available categories
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(list.map((item) => item.category).filter(Boolean)),
    ];
  }, [list]);

  // Search and category filtering
  const filteredProducts = useMemo(() => {
    return list.filter((item) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        item.name?.toLowerCase().includes(searchText) ||
        item.category?.toLowerCase().includes(searchText) ||
        item.subCategory?.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [list, search, selectedCategory]);

  // Delete product
  const removeProduct = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id: deleteId },
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success(response.data.message || "Product deleted successfully");

        setList((previous) => previous.filter((item) => item._id !== deleteId));

        setShowWarning(false);
        setDeleteId(null);
      } else {
        toast.error(response.data.message || "Unable to delete product");
      }
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setShowWarning(false);
    setDeleteId(null);
  };

  const selectedProduct = list.find((item) => item._id === deleteId);

  return (
    <div className="w-full space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            <FiPackage size={14} />
            Product Management
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Product List
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage, update and organize your store products.
          </p>
        </div>

        <button
          onClick={() => navigate("/add")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:bg-indigo-700 active:scale-[0.98]"
        >
          <FiPlus size={17} />
          Add New Product
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FiPackage size={19} />
          </div>
          <p className="text-xs font-medium text-gray-500">Total Products</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            {list.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <FiLayers size={19} />
          </div>
          <p className="text-xs font-medium text-gray-500">Categories</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            {categories.length - 1}
          </h2>
        </div>

        <div className="col-span-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:col-span-1 sm:p-5">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <FiTag size={19} />
          </div>
          <p className="text-xs font-medium text-gray-500">
            Displayed Products
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            {filteredProducts.length}
          </h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <div className="relative flex items-center gap-2">
            <FiFilter className="shrink-0 text-gray-400" size={17} />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full min-w-0 cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700 outline-none focus:border-indigo-500 sm:w-48"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <button
              onClick={fetchList}
              title="Refresh products"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-indigo-600"
            >
              <FiRefreshCw size={17} />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">{list.length}</span>{" "}
            products
          </p>

          {(search || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading products...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <FiPackage size={30} />
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-900">
            {list.length === 0 ? "No products yet" : "No products found"}
          </h3>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            {list.length === 0
              ? "Start building your store by adding your first product."
              : "Try changing your search or category filter."}
          </p>

          {list.length === 0 && (
            <button
              onClick={() => navigate("/add")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <FiPlus size={16} />
              Add Product
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Subcategory</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-gray-50/80"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                            {item.image?.[0] ? (
                              <img
                                src={item.image[0]}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-gray-300">
                                <FiPackage size={23} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate text-sm font-semibold text-gray-900">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              ID: {item._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                          {item.category || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.subCategory || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-900">
                          {currency}
                          {item.price}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/product/edit/${item._id}`)
                            }
                            title="Edit product"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <FiEdit2 size={16} />
                          </button>

                          <button
                            onClick={() => {
                              setDeleteId(item._id);
                              setShowWarning(true);
                            }}
                            title="Delete product"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Product Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
            {filteredProducts.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                    {item.image?.[0] ? (
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-300">
                        <FiPackage size={25} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold text-gray-900">
                      {item.name}
                    </h3>

                    <span className="mt-2 inline-flex max-w-full truncate rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                      {item.category || "Uncategorized"}
                    </span>

                    <p className="mt-2 text-sm font-bold text-gray-900">
                      {currency}
                      {item.price}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400">
                    {item.subCategory || "No subcategory"}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/product/edit/${item._id}`)}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setDeleteId(item._id);
                        setShowWarning(true);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                      aria-label={`Delete ${item.name}`}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showWarning && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 px-4 py-6 backdrop-blur-sm"
          onClick={closeDeleteModal}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-gray-900">
                Delete Product
              </h2>

              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close dialog"
              >
                <FiX size={19} />
              </button>
            </div>

            <div className="px-5 py-6 sm:px-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <FiAlertTriangle size={25} />
              </div>

              <h3 className="mt-4 text-center text-base font-bold text-gray-900">
                Are you sure?
              </h3>

              <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                You are about to delete{" "}
                <span className="font-semibold text-gray-800">
                  {selectedProduct?.name || "this product"}
                </span>
                . This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={removeProduct}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiTrash2 size={15} />
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
