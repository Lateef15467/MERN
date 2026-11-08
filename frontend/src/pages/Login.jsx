import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import SocialLogin from "../components/SocialLogin";
import { FaShoppingBag, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [currentState, setcurrentState] = useState("Login");
  const { token, settoken, setUser, navigate, backendUrl } =
    useContext(ShopContext);

  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
          role: "user",
        });

        if (response.data.success) {
          toast.success("OTP sent to your email!");
          localStorage.setItem("signupPassword", password);
          navigate(`/verify-otp?email=${email}`);
        } else {
          toast.error(response.data.message);
        }

        return;
      }

      const response = await axios.post(backendUrl + "/api/user/login", {
        email,
        password,
      });

      if (response.data.success) {
        settoken(response.data.token);
        localStorage.setItem("token", response.data.token);

        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        toast.success("Login successful!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-gray-50 px-4 py-12 sm:px-6">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-orange-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl lg:grid-cols-2">
        {/* Left Information Panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0B132B] p-10 text-white lg:flex xl:p-12">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[40px] border-white/5" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[40px] border-orange-400/10" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FCA311] text-[#0B132B]">
              <FaShoppingBag size={20} />
            </div>
            <span className="text-2xl font-bold tracking-wide">
              Balti<span className="text-[#FCA311]">Mart</span>
            </span>
          </div>

          <div className="relative z-10 my-12">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#FCA311]">
              Your Shopping Destination
            </p>

            <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
              Shopping Made
              <span className="block text-[#FCA311]">Simple & Easy.</span>
            </h2>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-300">
              Discover a convenient online shopping experience with BaltiMart.
              Explore products and enjoy shopping from the comfort of your home.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-6">
            <p className="text-sm text-gray-400">
              Bringing online shopping closer to Baltistan.
            </p>
          </div>
        </div>

        {/* Login / Signup Form */}
        <div className="flex flex-col justify-center px-5 py-10 sm:px-10 sm:py-12 lg:px-12 xl:px-16">
          {/* Mobile Brand */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCA311] text-white">
              <FaShoppingBag size={18} />
            </div>
            <span className="text-2xl font-bold text-[#0B132B]">
              Balti<span className="text-[#FCA311]">Mart</span>
            </span>
          </div>

          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#FCA311]">
              {currentState === "Login" ? "Welcome Back" : "Join BaltiMart"}
            </p>

            <h1 className="text-3xl font-bold text-[#0B132B] sm:text-4xl">
              {currentState === "Login" ? "Sign In" : "Create Account"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {currentState === "Login"
                ? "Sign in to your account to continue shopping."
                : "Create your account and start your shopping journey."}
            </p>
          </div>

          <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
            {currentState === "Sign Up" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  onChange={(e) => setname(e.target.value)}
                  value={name}
                  type="text"
                  autoComplete="name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#FCA311] focus:bg-white focus:ring-4 focus:ring-orange-100"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                onChange={(e) => setemail(e.target.value)}
                value={email}
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#FCA311] focus:bg-white focus:ring-4 focus:ring-orange-100"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <input
                  onChange={(e) => setpassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    currentState === "Login"
                      ? "current-password"
                      : "new-password"
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#FCA311] focus:bg-white focus:ring-4 focus:ring-orange-100"
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#FCA311]"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <SocialLogin mode={currentState} />

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="font-medium text-gray-500 transition-colors hover:text-[#FCA311]"
              >
                Forgot Password?
              </button>

              {currentState === "Login" ? (
                <button
                  type="button"
                  onClick={() => setcurrentState("Sign Up")}
                  className="font-semibold text-[#E58A00] transition-colors hover:text-[#0B132B]"
                >
                  Create Account
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setcurrentState("Login")}
                  className="font-semibold text-[#E58A00] transition-colors hover:text-[#0B132B]"
                >
                  Login Here
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 flex w-full items-center justify-center gap-3 rounded-xl bg-[#0B132B] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 ${
                loading
                  ? "cursor-not-allowed opacity-60"
                  : "hover:bg-[#FCA311] hover:text-[#0B132B] hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Please wait...
                </>
              ) : currentState === "Login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs leading-6 text-gray-400">
            By continuing, you agree to shop responsibly with BaltiMart.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
