import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiShield,
  FiShoppingBag,
  FiCalendar,
  FiDollarSign,
  FiLock,
  FiUnlock,
  FiTrash2,
  FiAlertTriangle,
  FiX,
  FiCheckCircle,
  FiPackage,
  FiRefreshCw,
} from "react-icons/fi";

const UserDetails = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  // Fetch user details and orders
  const fetchUser = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${backendUrl}/api/user/users/${id}`, {
        headers: { token },
      });

      if (res.data.success) {
        setUser(res.data.user);

        // Fetch user's orders
        try {
          const orderRes = await axios.post(
            `${backendUrl}/api/orders/userorders`,
            { userId: id },
            { headers: { token } },
          );

          if (orderRes.data.success) {
            setOrders(orderRes.data.orders || []);
          } else {
            toast.error(orderRes.data.message || "Failed to load orders");
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to load orders");
        }
      } else {
        setUser(null);
        toast.error(res.data.message || "User not found");
      }
    } catch (error) {
      console.error(error);
      setUser(null);
      toast.error(error.response?.data?.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Display name
  const displayName = user
    ? user.firstName || user.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user.name
    : "";

  // Order statistics
  const totalSpent = useMemo(
    () => orders.reduce((total, order) => total + Number(order.amount || 0), 0),
    [orders],
  );

  // Block / Unblock user
  const toggleBlock = async () => {
    if (!user) return;

    setActionLoading(true);

    try {
      const res = await axios.put(
        `${backendUrl}/api/user/block/${id}`,
        {},
        { headers: { token } },
      );

      if (res.data.success) {
        toast.success(res.data.message || "User status updated");

        setUser((prev) => ({
          ...prev,
          blocked: !prev.blocked,
        }));

        setShowBlockModal(false);
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete user
  const deleteUser = async () => {
    setActionLoading(true);

    try {
      const res = await axios.delete(`${backendUrl}/api/user/delete/${id}`, {
        headers: { token },
      });

      if (res.data.success) {
        toast.success("User deleted successfully");
        navigate("/users");
      } else {
        toast.error(res.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-11 h-11 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-500 mt-4">Loading user details...</p>
      </div>
    );
  }

  // User not found
  if (!user) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-center px-5">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <FiUser size={30} />
        </div>

        <h2 className="text-xl font-bold text-slate-800">User Not Found</h2>

        <p className="text-sm text-slate-500 mt-2">
          This user may have been deleted or does not exist.
        </p>

        <button
          onClick={() => navigate("/users")}
          className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
        >
          Back to Users
        </button>
      </div>
    );
  }

  const isAdmin = user.role?.toLowerCase() === "admin";

  return (
    <div className="w-full max-w-7xl mx-auto pb-10">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <span>Management</span>
            <span>/</span>
            <span>Users</span>
            <span>/</span>
            <span className="text-indigo-600 font-medium">User Details</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            User Details
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            View account information and customer order history.
          </p>
        </div>

        <button
          onClick={() => navigate("/users")}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
        >
          <FiArrowLeft size={16} />
          Back to Users
        </button>
      </div>

      {/* User profile */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">
        {/* Profile banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_30%,white_0,transparent_35%),radial-gradient(circle_at_80%_80%,white_0,transparent_35%)]" />
        </div>

        <div className="px-5 sm:px-8 pb-7">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 relative">
            <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
              <img
                src={assets.profile_icon}
                alt="User profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 sm:pb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">
                {displayName}
              </h2>

              <p className="text-sm text-slate-500 mt-1 break-all">
                {user.email}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:pb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold capitalize">
                <FiShield size={14} />
                {user.role || "User"}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                  user.blocked
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    user.blocked ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
                {user.blocked ? "Blocked" : "Active"}
              </span>
            </div>
          </div>

          {/* Account information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FiUser size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">Full Name</p>
                <p className="text-sm font-semibold text-slate-700 mt-1 truncate">
                  {displayName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <FiMail size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="text-sm font-semibold text-slate-700 mt-1 break-all">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <FiShield size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">Account Role</p>
                <p className="text-sm font-semibold text-slate-700 mt-1 capitalize">
                  {user.role || "User"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  user.blocked
                    ? "bg-red-50 text-red-500"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {user.blocked ? (
                  <FiLock size={19} />
                ) : (
                  <FiCheckCircle size={19} />
                )}
              </div>

              <div>
                <p className="text-xs text-slate-400">Account Status</p>
                <p
                  className={`text-sm font-semibold mt-1 ${
                    user.blocked ? "text-red-500" : "text-emerald-600"
                  }`}
                >
                  {user.blocked ? "Blocked" : "Active"}
                </p>
              </div>
            </div>
          </div>

          {/* Account actions */}
          {!isAdmin && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={() => setShowBlockModal(true)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition ${
                  user.blocked
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
              >
                {user.blocked ? <FiUnlock size={17} /> : <FiLock size={17} />}
                {user.blocked ? "Unblock User" : "Block User"}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
              >
                <FiTrash2 size={17} />
                Delete User
              </button>
            </div>
          )}

          {isAdmin && (
            <div className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-sm text-indigo-700">
              <FiShield className="inline mr-2" size={17} />
              Admin accounts cannot be blocked or deleted from this page.
            </div>
          )}
        </div>
      </section>

      {/* Order statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Orders</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-2">
                {orders.length}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FiShoppingBag size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Total Order Amount
              </p>
              <h2 className="text-2xl font-bold text-emerald-600 mt-2">
                Rs. {totalSpent.toLocaleString()}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiDollarSign size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Order history */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FiPackage size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">Order History</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {orders.length} orders placed by this customer
              </p>
            </div>
          </div>

          <button
            onClick={fetchUser}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
          >
            <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <FiShoppingBag size={28} />
            </div>

            <h3 className="font-semibold text-slate-700">No Orders Yet</h3>

            <p className="text-sm text-slate-400 mt-1 text-center">
              This customer has not placed any orders.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-5 sm:px-7 hover:bg-slate-50/70 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400 font-medium">
                      ORDER ID
                    </p>

                    <p className="text-sm font-semibold text-slate-800 mt-1 break-all">
                      {order._id}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                      <FiCalendar size={13} />
                      {order.date
                        ? new Date(order.date).toLocaleDateString()
                        : "Date unavailable"}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <div className="bg-indigo-50 px-4 py-2.5 rounded-xl">
                      <p className="text-xs text-indigo-500">Order Amount</p>
                      <p className="text-sm font-bold text-indigo-700 mt-0.5">
                        Rs. {Number(order.amount || 0).toLocaleString()}
                      </p>
                    </div>

                    {order.status && (
                      <span className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        {order.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Block confirmation modal */}
      {showBlockModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !actionLoading && setShowBlockModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
                user.blocked
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {user.blocked ? (
                <FiUnlock size={25} />
              ) : (
                <FiAlertTriangle size={25} />
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-800 mt-4">
              {user.blocked ? "Unblock User?" : "Block User?"}
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-6">
              Are you sure you want to {user.blocked ? "unblock" : "block"}{" "}
              <strong className="text-slate-700">{displayName}</strong>?
            </p>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setShowBlockModal(false)}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={toggleBlock}
                disabled={actionLoading}
                className={`flex-1 py-3 rounded-xl text-white text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2 ${
                  user.blocked
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-amber-600 hover:bg-amber-700"
                }`}
              >
                {actionLoading
                  ? "Processing..."
                  : user.blocked
                    ? "Yes, Unblock"
                    : "Yes, Block"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !actionLoading && setShowDeleteModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl mx-auto bg-red-50 text-red-600 flex items-center justify-center">
              <FiTrash2 size={25} />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mt-4">
              Delete User Permanently?
            </h3>

            <p className="text-sm text-slate-500 mt-2 leading-6">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-700">{displayName}</strong>? This
              action cannot be undone.
            </p>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={deleteUser}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
