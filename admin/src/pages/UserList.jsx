import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  FiUsers,
  FiUser,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiShield,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiChevronRight,
  FiAlertCircle,
} from "react-icons/fi";

const UserList = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // Fetch all users
  const fetchUsers = async () => {
    if (!token) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${backendUrl}/api/user/users`, {
        headers: { token },
      });

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        toast.error(response.data.message || "Unable to fetch users");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Get display name
  const getDisplayName = (user) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }

    return user.name || "Unknown User";
  };

  // Search users
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) => {
      const name = getDisplayName(user).toLowerCase();
      const email = (user.email || "").toLowerCase();
      const id = (user._id || "").toLowerCase();
      const role = (user.role || "").toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        id.includes(query) ||
        role.includes(query)
      );
    });
  }, [users, search]);

  // Statistics
  const activeUsers = users.filter((user) => !user.blocked).length;
  const blockedUsers = users.filter((user) => user.blocked).length;

  // Role styling
  const getRoleStyle = (role) => {
    switch ((role || "user").toLowerCase()) {
      case "admin":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "vendor":
        return "bg-blue-50 text-blue-700 border-blue-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />

        <p className="text-sm font-medium text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/70 p-3 sm:p-5 lg:p-7">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <FiUsers size={26} className="text-gray-800" />

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Users
            </h1>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor your BaltiMart customers and accounts.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
        >
          <FiRefreshCw size={16} />
          Refresh Users
        </button>
      </div>

      {/* ================= STATISTICS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Total Users */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>

              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {users.length}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <FiUsers size={23} className="text-gray-700" />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Users</p>

              <h2 className="text-2xl font-bold text-green-600 mt-2">
                {activeUsers}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <FiUserCheck size={23} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Blocked Users</p>

              <h2 className="text-2xl font-bold text-red-600 mt-2">
                {blockedUsers}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <FiUserX size={23} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, role or ID..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none text-sm focus:border-gray-500 focus:ring-2 focus:ring-gray-100 transition-all"
            />
          </div>

          <p className="text-xs text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}

      <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <FiUsers size={35} className="mx-auto text-gray-300 mb-3" />

            <h3 className="text-lg font-semibold text-gray-800">
              {search ? "No matching users found" : "No users available"}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {search
                ? "Try searching with another name, email or role."
                : "Registered users will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email Address
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Account Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const displayName = getDisplayName(user);

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      {/* User Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold shrink-0">
                            {displayName.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {displayName}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              ID: {String(user._id).slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiMail size={15} className="text-gray-400" />

                          {user.email || "No email"}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${getRoleStyle(
                            user.role,
                          )}`}
                        >
                          <FiShield size={13} />
                          {user.role || "user"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 text-xs font-semibold ${
                            user.blocked ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              user.blocked ? "bg-red-500" : "bg-green-500"
                            }`}
                          />

                          {user.blocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => navigate(`/users/${user._id}`)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-all"
                        >
                          <FiEye size={15} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MOBILE USER CARDS ================= */}

      <div className="md:hidden space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl py-14 px-4 text-center">
            <FiUsers size={35} className="mx-auto text-gray-300 mb-3" />

            <h3 className="text-lg font-semibold text-gray-800">
              {search ? "No matching users found" : "No users available"}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {search
                ? "Try another search."
                : "Registered users will appear here."}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const displayName = getDisplayName(user);

            return (
              <div
                key={user._id}
                onClick={() => navigate(`/users/${user._id}`)}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all p-5 cursor-pointer"
              >
                {/* User Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-lg font-bold shrink-0">
                      {displayName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-gray-900 truncate">
                        {displayName}
                      </h2>

                      <p className="text-xs text-gray-400 mt-1">
                        ID: {String(user._id).slice(-8)}
                      </p>
                    </div>
                  </div>

                  <FiChevronRight
                    size={20}
                    className="text-gray-400 shrink-0"
                  />
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 mt-5 text-sm text-gray-600 break-all">
                  <FiMail size={16} className="text-gray-400 shrink-0" />
                  {user.email || "No email"}
                </div>

                {/* Role and Status */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${getRoleStyle(
                      user.role,
                    )}`}
                  >
                    <FiShield size={13} />
                    {user.role || "user"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      user.blocked
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        user.blocked ? "bg-red-500" : "bg-green-500"
                      }`}
                    />

                    {user.blocked ? "Blocked" : "Active"}
                  </span>
                </div>

                {/* View Details */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/users/${user._id}`);
                  }}
                  className="flex items-center justify-center gap-2 w-full mt-5 py-3 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-all"
                >
                  <FiEye size={16} />
                  View User Details
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserList;
