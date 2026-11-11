import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiMenu,
  FiLogOut,
  FiShield,
  FiUser,
  FiBell,
  FiShoppingBag,
  FiUserPlus,
  FiX,
  FiTrash2,
} from "react-icons/fi";

import { assets } from "../../../frontend/src/assets/frontend_assets/assets";

const Navbar = ({ settoken, role, onMenuClick }) => {
  const isAdmin = role?.toLowerCase() === "admin";

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const STORAGE_KEY = "shopnow_admin_notifications";
  const ORDER_KEY = "shopnow_seen_orders";
  const USER_KEY = "shopnow_seen_users";

  // Load saved notifications
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setNotifications(saved);
    } catch {
      setNotifications([]);
    }
  }, []);

  // Save notifications
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Check new orders and registered users
  useEffect(() => {
    if (!token || !backendUrl) return;

    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        if (isMounted) setLoadingNotifications(true);

        const [orderResponse, userResponse] = await Promise.all([
          axios.post(
            `${backendUrl}/api/orders/list`,
            {},
            { headers: { token } },
          ),
          axios.get(`${backendUrl}/api/user/users`, {
            headers: { token },
          }),
        ]);

        if (!isMounted) return;

        if (!orderResponse.data.success || !userResponse.data.success) {
          return;
        }

        const orders = orderResponse.data.orders || [];

        const users = (userResponse.data.users || []).filter(
          (user) => user.role === "user" && user.isVerified === true,
        );

        const currentOrderIds = orders.map((order) => String(order._id));
        const currentUserIds = users.map((user) => String(user._id));

        const savedOrderIds = localStorage.getItem(ORDER_KEY);
        const savedUserIds = localStorage.getItem(USER_KEY);

        if (savedOrderIds === null || savedUserIds === null) {
          localStorage.setItem(ORDER_KEY, JSON.stringify(currentOrderIds));
          localStorage.setItem(USER_KEY, JSON.stringify(currentUserIds));
          return;
        }

        const previousOrderIds = JSON.parse(savedOrderIds);
        const previousUserIds = JSON.parse(savedUserIds);

        const newOrders = orders.filter(
          (order) => !previousOrderIds.includes(String(order._id)),
        );

        const newUsers = users.filter(
          (user) => !previousUserIds.includes(String(user._id)),
        );

        if (newOrders.length || newUsers.length) {
          const newNotifications = [
            ...newOrders.map((order) => ({
              id: `order-${order._id}`,
              type: "order",
              title: "New Order Received",
              message: `Order #${String(order._id).slice(-8)} has been placed.`,
              createdAt: Date.now(),
              isRead: false,
              target: "/orders",
            })),

            ...newUsers.map((user) => ({
              id: `user-${user._id}`,
              type: "user",
              title: "New Customer Registered",
              message: `${user.name || "A customer"} has registered.`,
              createdAt: Date.now(),
              isRead: false,
              target: "/users",
            })),
          ];

          setNotifications((previous) => {
            const existingIds = new Set(previous.map((item) => item.id));

            const uniqueNotifications = newNotifications.filter(
              (item) => !existingIds.has(item.id),
            );

            return [...uniqueNotifications, ...previous].slice(0, 50);
          });
        }

        localStorage.setItem(ORDER_KEY, JSON.stringify(currentOrderIds));
        localStorage.setItem(USER_KEY, JSON.stringify(currentUserIds));
      } catch (error) {
        console.error(
          "Notification error:",
          error.response?.data || error.message,
        );
      } finally {
        if (isMounted) setLoadingNotifications(false);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [token, backendUrl]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, isRead: true })),
    );
  };

  // Delete one notification
  const deleteNotification = (id) => {
    setNotifications((previous) => previous.filter((item) => item.id !== id));
  };

  // Delete all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Open notification
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setShowNotifications(false);
    navigate(notification.target);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className="sticky top-0 z-40 h-[64px] w-full border-b border-gray-200 bg-white sm:h-[72px]">
      <div className="flex h-full items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        {/* Logo and Menu */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 sm:h-10 sm:w-10 lg:hidden"
            aria-label="Open navigation menu"
          >
            <FiMenu size={20} />
          </button>

          <Link to="/add" className="flex min-w-0 items-center">
            <img
              src={assets.logo}
              alt="Logo"
              className="h-8 w-auto max-w-[105px] object-contain sm:h-10 sm:max-w-[145px]"
            />
          </Link>

          <div className="hidden h-8 w-px bg-gray-200 md:block" />

          <div className="hidden md:block">
            <p className="text-sm font-semibold tracking-tight text-gray-800">
              Management Portal
            </p>
            <p className="text-[11px] text-gray-400">
              Manage your store efficiently
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 sm:h-10 sm:w-10"
              aria-label="Notifications"
            >
              <FiBell size={19} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="fixed left-3 right-3 top-[70px] z-50 mx-auto max-h-[calc(100vh-85px)] w-auto overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-14 sm:mx-0 sm:max-h-none sm:w-[390px]">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-3 py-3 sm:px-4 sm:py-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900">
                      Notifications
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      {unreadCount} unread notifications
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 sm:text-xs"
                      >
                        Mark all read
                      </button>
                    )}

                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[10px] font-semibold text-red-500 hover:text-red-700 sm:text-xs"
                      >
                        Clear all
                      </button>
                    )}

                    <button
                      onClick={() => setShowNotifications(false)}
                      className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                      aria-label="Close notifications"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[calc(100vh-190px)] overflow-y-auto sm:max-h-[380px]">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                      <FiBell size={30} className="mb-3 text-gray-300" />
                      <p className="text-sm font-semibold text-gray-700">
                        No notifications yet
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        New orders and registrations will appear here.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-2 border-b border-gray-100 px-3 py-3 transition hover:bg-gray-50 sm:gap-3 sm:px-4 sm:py-4 ${
                          !notification.isRead ? "bg-indigo-50/50" : ""
                        }`}
                      >
                        <button
                          onClick={() => handleNotificationClick(notification)}
                          className="flex min-w-0 flex-1 items-start gap-2 text-left sm:gap-3"
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
                              notification.type === "order"
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {notification.type === "order" ? (
                              <FiShoppingBag size={18} />
                            ) : (
                              <FiUserPlus size={18} />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-gray-800">
                                {notification.title}
                              </span>

                              {!notification.isRead && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                              )}
                            </span>

                            <span className="mt-1 block break-words text-xs leading-5 text-gray-500">
                              {notification.message}
                            </span>

                            <span className="mt-2 block text-[10px] text-gray-400">
                              {formatTime(notification.createdAt)}
                            </span>
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteNotification(notification.id)}
                          className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete notification"
                          aria-label="Delete notification"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-3 py-3 text-center sm:px-4">
                  <p className="text-[10px] text-gray-400">
                    Checking every 15 seconds
                    {loadingNotifications ? " • Updating..." : ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Role */}
          <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              {isAdmin ? <FiShield size={15} /> : <FiUser size={15} />}
            </span>

            <div>
              <p className="text-xs font-semibold capitalize text-gray-800">
                {role || "User"}
              </p>
              <p className="text-[10px] text-gray-400">Account</p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={settoken}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-gray-900 px-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:h-auto sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <FiLogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
