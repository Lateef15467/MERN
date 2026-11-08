import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiShield } from "react-icons/fi";
import { assets } from "../assets/assets";

const Login = ({ settoken, setRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(`${backendUrl}/api/user/admin`, {
        email,
        password,
      });

      if (response.data.success) {
        const { token, role } = response.data;
        const normalizedRole = String(role || "").toLowerCase();

        if (!token || !normalizedRole) {
          toast.error("Login response is missing account information");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("role", normalizedRole);

        setRole(normalizedRole);
        settoken(token);

        toast.success("Welcome back!");
        navigate("/add", { replace: true });
      } else {
        toast.error(response.data.message || "Invalid login details");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to login. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f6fb] px-4 py-10">
      {/* Background decoration */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-slate-200/70 md:grid-cols-2">
        {/* Left panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#111827] p-10 text-white md:flex lg:p-14">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[45px] border-indigo-500/10" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border-[50px] border-indigo-500/10" />

          <div className="relative z-10">
            {assets.logo && (
              <img
                src={assets.logo}
                alt="Logo"
                className="mb-14 h-12 max-w-[180px] object-contain"
              />
            )}

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-950/30">
              <FiShield size={27} />
            </div>

            <h1 className="max-w-sm text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Manage your store with confidence.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Your central workspace to manage products, orders, customers,
              suppliers and vendors.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-6">
            <p className="text-xs text-slate-500">
              Secure Store Management Portal
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 md:hidden">
                <FiShield size={23} />
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-indigo-600">
                Welcome Back
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Sign in to continue
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Enter your account details to access your workspace.
              </p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="username"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-20 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#111827] py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <FiArrowRight size={17} />}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-gray-400">
              Protected access · Authorized accounts only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
