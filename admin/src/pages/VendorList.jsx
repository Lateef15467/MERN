import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import {
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiShield,
  FiLock,
  FiUnlock,
  FiX,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";

const VendorList = ({ token }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Fetch vendors
  const fetchVendors = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${backendUrl}/api/vendor/list`, {
        headers: { token },
      });

      if (res.data.success) {
        setVendors(res.data.vendors || []);
      } else {
        toast.error(res.data.message || "Failed to load vendors");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching vendors");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Search and status filtering
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const query = search.toLowerCase();

      const matchesSearch =
        vendor.name?.toLowerCase().includes(query) ||
        vendor.email?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && !vendor.blocked) ||
        (statusFilter === "Blocked" && vendor.blocked);

      return matchesSearch && matchesStatus;
    });
  }, [vendors, search, statusFilter]);

  // Statistics
  const activeVendors = vendors.filter((vendor) => !vendor.blocked).length;
  const blockedVendors = vendors.filter((vendor) => vendor.blocked).length;

  // Block / unblock vendor
  const toggleBlock = async () => {
    if (!selectedVendor) return;

    setActionLoading(true);

    try {
      const res = await axios.put(
        `${backendUrl}/api/vendor/block/${selectedVendor._id}`,
        {},
        { headers: { token } },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Vendor status updated");

        setVendors((prev) =>
          prev.map((vendor) =>
            vendor._id === selectedVendor._id
              ? { ...vendor, blocked: !vendor.blocked }
              : vendor,
          ),
        );

        setSelectedVendor(null);
      } else {
        toast.error(res.data.message || "Action failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-10">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <span>Management</span>
            <span>/</span>
            <span className="text-indigo-600 font-medium">Vendors</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Vendor Management
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            View and manage all registered vendors.
          </p>
        </div>

        <button
          onClick={fetchVendors}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh List
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Total Vendors
              </p>
              <h2 className="text-2xl font-bold text-slate-800 mt-2">
                {vendors.length}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FiUsers size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Active Vendors
              </p>
              <h2 className="text-2xl font-bold text-emerald-600 mt-2">
                {activeVendors}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiCheckCircle size={22} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Blocked Vendors
              </p>
              <h2 className="text-2xl font-bold text-red-500 mt-2">
                {blockedVendors}
              </h2>
            </div>

            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <FiLock size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Main table section */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Search and filters */}
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="font-bold text-slate-800">All Vendors</h2>
              <p className="text-xs text-slate-500 mt-1">
                {filteredVendors.length} vendor
                {filteredVendors.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FiSearch
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or email..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 outline-none focus:border-indigo-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 mt-4">Loading vendors...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <FiUsers size={28} />
            </div>

            <h3 className="font-semibold text-slate-700">No vendors found</h3>

            <p className="text-sm text-slate-400 mt-1 text-center">
              {search || statusFilter !== "All"
                ? "Try changing your search or filter."
                : "No vendors have been registered yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Vendor</th>
                    <th className="px-6 py-4 font-semibold">Email Address</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredVendors.map((vendor) => (
                    <tr
                      key={vendor._id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            {vendor.name?.charAt(0)?.toUpperCase() || "V"}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {vendor.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              ID: {vendor._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {vendor.email}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold capitalize">
                          <FiShield size={13} />
                          {vendor.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {vendor.blocked ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                            vendor.blocked
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          {vendor.blocked ? (
                            <FiUnlock size={14} />
                          ) : (
                            <FiLock size={14} />
                          )}
                          {vendor.blocked ? "Unblock" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredVendors.map((vendor) => (
                <div key={vendor._id} className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                      {vendor.name?.charAt(0)?.toUpperCase() || "V"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-800 truncate">
                        {vendor.name}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 break-all">
                        <FiMail size={13} className="shrink-0" />
                        {vendor.email}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold capitalize">
                          {vendor.role}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            vendor.blocked
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {vendor.blocked ? "Blocked" : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className={`w-full mt-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
                      vendor.blocked
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    {vendor.blocked ? (
                      <FiUnlock size={16} />
                    ) : (
                      <FiLock size={16} />
                    )}
                    {vendor.blocked ? "Unblock Vendor" : "Block Vendor"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Confirmation modal */}
      {selectedVendor && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !actionLoading && setSelectedVendor(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <button
                onClick={() => setSelectedVendor(null)}
                disabled={actionLoading}
                className="absolute"
                aria-label="Close"
              >
                <FiX className="text-slate-400" />
              </button>

              <div
                className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
                  selectedVendor.blocked
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}
              >
                {selectedVendor.blocked ? (
                  <FiUnlock size={25} />
                ) : (
                  <FiAlertTriangle size={25} />
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-800 mt-4">
                {selectedVendor.blocked ? "Unblock Vendor?" : "Block Vendor?"}
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-6">
                Are you sure you want to{" "}
                {selectedVendor.blocked ? "unblock" : "block"}{" "}
                <strong className="text-slate-700">
                  {selectedVendor.name}
                </strong>
                ?
              </p>

              <div className="flex gap-3 mt-7">
                <button
                  onClick={() => setSelectedVendor(null)}
                  disabled={actionLoading}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={toggleBlock}
                  disabled={actionLoading}
                  className={`flex-1 py-3 rounded-xl text-white text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2 ${
                    selectedVendor.blocked
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {actionLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : selectedVendor.blocked ? (
                    "Yes, Unblock"
                  ) : (
                    "Yes, Block"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;
