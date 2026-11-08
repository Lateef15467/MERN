import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

import {
  FiPackage,
  FiSearch,
  FiTrash2,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiX,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiUser,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search
  const [search, setSearch] = useState("");

  // Selection
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Delete confirmation
  const [showPopup, setShowPopup] = useState(false);
  const [deleteIds, setDeleteIds] = useState([]);

  // Delete loading
  const [deleting, setDeleting] = useState(false);

  // Status updating
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all orders
  const fetchAllOrders = async () => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        backendUrl + "/api/orders/list",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        setOrders([...(response.data.orders || [])].reverse());
        setSelectedOrders([]);
      } else {
        toast.error(response.data.message || "Unable to fetch orders");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return orders;

    return orders.filter((order) => {
      const customerName = `${order.address?.firstName || ""} ${
        order.address?.lastName || ""
      }`.toLowerCase();

      const phone = String(order.address?.phone || "").toLowerCase();

      const orderId = String(order._id || "").toLowerCase();

      return (
        customerName.includes(query) ||
        phone.includes(query) ||
        orderId.includes(query)
      );
    });
  }, [orders, search]);

  // Order statistics
  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  const pendingCount = orders.filter(
    (order) => order.status !== "Delivered",
  ).length;

  // Select individual order
  const toggleOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  // Select all currently filtered orders
  const toggleSelectAll = () => {
    const visibleIds = filteredOrders.map((order) => order._id);

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedOrders.includes(id));

    if (allSelected) {
      setSelectedOrders((prev) =>
        prev.filter((id) => !visibleIds.includes(id)),
      );
    } else {
      setSelectedOrders((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const allVisibleSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => selectedOrders.includes(order._id));

  // Update order status
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    setUpdatingId(orderId);

    try {
      const response = await axios.post(
        backendUrl + "/api/orders/status",
        {
          orderId,
          status: newStatus,
        },
        { headers: { token } },
      );

      if (response.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order,
          ),
        );

        toast.success("Order status updated");
      } else {
        toast.error(response.data.message || "Status update failed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (ids) => {
    const validIds = Array.isArray(ids) ? ids : [ids];

    if (validIds.length === 0) return;

    setDeleteIds(validIds);
    setShowPopup(true);
  };

  // Delete selected orders one by one using existing API
  const confirmDelete = async () => {
    if (!deleteIds.length) return;

    setDeleting(true);

    try {
      const results = await Promise.allSettled(
        deleteIds.map((id) =>
          axios.delete(`${backendUrl}/api/orders/delete/${id}`, {
            headers: { token },
          }),
        ),
      );

      const successfulIds = [];
      let failedCount = 0;

      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value.data.success) {
          successfulIds.push(deleteIds[index]);
        } else {
          failedCount++;
        }
      });

      if (successfulIds.length > 0) {
        setOrders((prev) =>
          prev.filter((order) => !successfulIds.includes(order._id)),
        );

        setSelectedOrders((prev) =>
          prev.filter((id) => !successfulIds.includes(id)),
        );

        toast.success(`${successfulIds.length} order(s) deleted successfully`);
      }

      if (failedCount > 0) {
        toast.error(`${failedCount} order(s) could not be deleted`);
      }

      setShowPopup(false);
      setDeleteIds([]);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";

      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Out for Delivery":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "Packing":
        return "bg-amber-50 text-amber-700 border-amber-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/70 p-3 sm:p-5 lg:p-7">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <FiPackage className="text-gray-800" size={25} />

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Orders
            </h1>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Manage, track and process customer orders.
          </p>
        </div>

        <button
          onClick={fetchAllOrders}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
        >
          <FiRefreshCw size={16} />
          Refresh Orders
        </button>
      </div>

      {/* ================= STATISTICS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>

              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {orders.length}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <FiShoppingBag size={23} className="text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Pending / Processing
              </p>

              <h2 className="text-2xl font-bold text-amber-600 mt-2">
                {pendingCount}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <FiClock size={23} className="text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Delivered Orders
              </p>

              <h2 className="text-2xl font-bold text-green-600 mt-2">
                {deliveredCount}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <FiCheckCircle size={23} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= SEARCH AND ACTIONS ================= */}

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 mb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, phone or order ID..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none text-sm focus:border-gray-500 focus:ring-2 focus:ring-gray-100 transition-all"
            />
          </div>

          {/* Selection Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-500">
              {selectedOrders.length} selected
            </span>

            <button
              onClick={() => handleDeleteClick(selectedOrders)}
              disabled={selectedOrders.length === 0 || deleting}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <FiTrash2 size={16} />
              Delete Selected
            </button>
          </div>
        </div>
      </div>

      {/* ================= SELECT ALL ================= */}

      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between px-2 mb-4">
          <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-gray-600">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleSelectAll}
              className="w-4 h-4 accent-black cursor-pointer"
            />
            Select all visible orders
          </label>

          <p className="text-xs text-gray-400">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>
      )}

      {/* ================= ORDERS LIST ================= */}

      <div className="space-y-5">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-16 px-4 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiPackage size={30} className="text-gray-400" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              {search ? "No matching orders found" : "No orders yet"}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {search
                ? "Try searching with another name, phone number or order ID."
                : "Customer orders will appear here."}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isSelected = selectedOrders.includes(order._id);

            return (
              <div
                key={order._id}
                className={`bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? "border-blue-300 ring-1 ring-blue-100"
                    : "border-gray-100"
                }`}
              >
                {/* Order Top Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-gray-50/70 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOrder(order._id)}
                      aria-label={`Select order ${order._id}`}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />

                    <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center">
                      <FiPackage size={21} className="text-gray-700" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        Order #{String(order._id).slice(-8).toUpperCase()}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {order.date
                          ? new Date(order.date).toLocaleString()
                          : "Date unavailable"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusStyle(
                      order.status,
                    )}`}
                  >
                    {order.status || "Order Placed"}
                  </span>
                </div>

                {/* Order Content */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
                    {/* Left: Customer and Products */}
                    <div className="space-y-5">
                      {/* Customer */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FiUser size={17} className="text-gray-500" />

                          <h3 className="text-sm font-bold text-gray-800">
                            Customer Information
                          </h3>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="font-semibold text-gray-900">
                            {order.address?.firstName} {order.address?.lastName}
                          </p>

                          <div className="flex items-start gap-2 text-sm text-gray-500 mt-2">
                            <FiMapPin size={16} className="mt-0.5 shrink-0" />

                            <div>
                              <p>{order.address?.street}</p>

                              <p>
                                {[
                                  order.address?.city,
                                  order.address?.state,
                                  order.address?.country,
                                  order.address?.zipcode,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                            <FiPhone size={15} />
                            {order.address?.phone || "Not provided"}
                          </div>
                        </div>
                      </div>

                      {/* Products */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <FiShoppingBag size={17} className="text-gray-500" />

                          <h3 className="text-sm font-bold text-gray-800">
                            Ordered Products
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {order.items?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl p-3"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 break-words">
                                  {item.name}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  Size: {item.size || "N/A"}
                                </p>
                              </div>

                              <span className="shrink-0 text-xs font-semibold bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Payment and Status */}
                    <div className="space-y-5">
                      {/* Order Summary */}
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3">
                          Order Summary
                        </h3>

                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Total Items</span>

                            <span className="font-semibold text-gray-800">
                              {order.items?.length || 0}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">
                              Payment Method
                            </span>

                            <span className="font-semibold text-gray-800 capitalize">
                              {order.paymentMethod || "N/A"}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">
                              Payment Status
                            </span>

                            <span
                              className={`font-semibold ${
                                order.payment
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {order.payment ? "Paid" : "Pending"}
                            </span>
                          </div>

                          <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-700">
                              Total Amount
                            </span>

                            <span className="text-xl font-bold text-gray-900">
                              {currency}
                              {order.amount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Update Status */}
                      <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">
                          Update Order Status
                        </label>

                        <div className="relative">
                          <select
                            onChange={(event) =>
                              statusHandler(event, order._id)
                            }
                            value={order.status}
                            disabled={updatingId === order._id}
                            className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 bg-white outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-100 disabled:opacity-50"
                          >
                            <option value="OrderPlaced">Order Placed</option>

                            <option value="Packing">Packing</option>

                            <option value="Shipped">Shipped</option>

                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>

                            <option value="Delivered">Delivered</option>
                          </select>

                          <FiTruck className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {updatingId === order._id && (
                          <p className="text-xs text-gray-400 mt-2">
                            Updating status...
                          </p>
                        )}
                      </div>

                      {/* Delete Single Order */}
                      <button
                        onClick={() => handleDeleteClick(order._id)}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-all"
                      >
                        <FiTrash2 size={16} />
                        Delete This Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}

      {showPopup && (
        <div
          onClick={() => !deleting && setShowPopup(false)}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn"
          >
            <div className="flex items-center justify-center w-14 h-14 bg-red-50 rounded-full mx-auto mb-4">
              <FiAlertTriangle size={27} className="text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center">
              Confirm Delete
            </h3>

            <p className="text-sm text-gray-500 text-center mt-3 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                {deleteIds.length}
                {deleteIds.length === 1 ? " order" : " orders"}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row justify-center gap-3 mt-7">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setDeleteIds([]);
                }}
                disabled={deleting}
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 transition-all"
              >
                {deleting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    Delete {deleteIds.length}{" "}
                    {deleteIds.length === 1 ? "Order" : "Orders"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Order;
