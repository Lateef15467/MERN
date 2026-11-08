import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import {
  FiUserPlus,
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const AddVendor = ({ token }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/vendor/add`,
        {
          name,
          email,
          password,
        },
        {
          headers: { token },
        },
      );

      if (res.data?.success) {
        toast.success("Vendor added successfully");
        navigate("/users");
      } else {
        toast.error(res.data?.message || "Failed to add vendor");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";

  return (
    <div className="w-full max-w-5xl mx-auto pb-10">
      {/* Page heading */}
      <div className="mb-7">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
          <span>Management</span>
          <span>/</span>
          <span className="text-indigo-600 font-medium">Add Vendor</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Add New Vendor
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create a vendor account for your BaltiMart store.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/vendorList")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
          >
            <FiArrowLeft size={16} />
            Back to Vendors
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Information panel */}
        <div className="lg:col-span-2">
          <div className="h-full min-h-64 rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-6 sm:p-8 text-white shadow-lg shadow-indigo-600/10 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mb-6">
                <FiUserPlus size={27} />
              </div>

              <h2 className="text-2xl font-bold leading-tight">
                Grow Your Vendor Network
              </h2>

              <p className="text-indigo-100 text-sm leading-6 mt-3">
                Add trusted vendors to your store and provide them with access
                to manage their assigned products and orders.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <FiCheckCircle size={17} />
                </div>
                <span className="text-sm text-indigo-50">
                  Create vendor accounts
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                  <FiShield size={17} />
                </div>
                <span className="text-sm text-indigo-50">
                  Secure account credentials
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={submitHandler}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-5 sm:px-7 py-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FiUserPlus size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">Vendor Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter the vendor's account details.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-7 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Vendor Name
                </label>

                <div className="relative">
                  <FiUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter vendor's full name"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vendor@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Password must contain at least 6 characters.
                </p>
              </div>

              {/* Role information */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <FiShield
                  className="text-indigo-600 mt-0.5 shrink-0"
                  size={19}
                />

                <div>
                  <p className="text-sm font-semibold text-indigo-900">
                    Vendor Account
                  </p>
                  <p className="text-xs text-indigo-700 leading-5 mt-1">
                    The account role is assigned automatically by your backend.
                    No manual role selection is required here.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/vendorList")}
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Vendor...
                    </>
                  ) : (
                    <>
                      <FiUserPlus size={18} />
                      Create Vendor
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVendor;
