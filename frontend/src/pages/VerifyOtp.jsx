import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import {
  FiMail,
  FiShield,
  FiRefreshCw,
  FiArrowLeft,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef([]);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email");

  const { setUser, settoken } = useContext(ShopContext);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // OTP input handler
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    // Support pasting a complete OTP
    if (value.length > 1) {
      const pastedOtp = value.slice(0, 6).split("");
      const updated = ["", "", "", "", "", ""];

      pastedOtp.forEach((digit, i) => {
        updated[i] = digit;
      });

      setOtp(updated);

      const nextIndex = Math.min(pastedOtp.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter complete 6-digit OTP");
      return;
    }

    if (!email) {
      toast.error("Email is missing. Please sign up again.");
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Verify OTP
      const response = await axios.post(`${backendUrl}/api/user/verify-otp`, {
        email,
        otp: finalOtp,
      });

      if (response.data.success) {
        toast.success("Email Verified Successfully!");

        // Step 2: Auto Login
        const savedPassword = localStorage.getItem("signupPassword");

        if (!savedPassword) {
          toast.error("Password missing! Please login manually.");
          localStorage.removeItem("signupPassword");
          navigate("/login");
          return;
        }

        const loginRes = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password: savedPassword,
        });

        if (loginRes.data.success) {
          localStorage.setItem("token", loginRes.data.token);
          localStorage.setItem("user", JSON.stringify(loginRes.data.user));

          settoken(loginRes.data.token);
          setUser(loginRes.data.user);

          localStorage.removeItem("signupPassword");

          navigate("/");
        } else {
          toast.error(loginRes.data.message || "Login failed");
        }
      } else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (timer > 0 || !email || isResending) return;

    try {
      setIsResending(true);

      await axios.post(`${backendUrl}/api/user/resend-otp`, { email });

      toast.success("OTP sent again!");

      setOtp(["", "", "", "", "", ""]);
      setTimer(30);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        {/* Verification card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/70 overflow-hidden">
          {/* Top accent */}
          <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300" />

          <form onSubmit={handleVerify} className="px-5 py-9 sm:px-9 sm:py-10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <FiShield size={31} />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[3px] text-orange-500 mb-2">
                BaltiMart Security
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Verify Your Email
              </h1>

              <p className="text-sm text-gray-500 mt-3 leading-6">
                Enter the 6-digit verification code we sent to your email
                address.
              </p>
            </div>

            {/* Email information */}
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-orange-50 border border-orange-100 p-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-orange-500 flex-shrink-0">
                <FiMail size={19} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  Verification email sent to
                </p>

                <p className="text-sm font-semibold text-gray-800 break-all">
                  {email || "Your email"}
                </p>
              </div>
            </div>

            {/* OTP inputs */}
            <div className="mt-8">
              <label className="block text-center text-sm font-semibold text-gray-700 mb-4">
                Enter Verification Code
              </label>

              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={digit}
                    disabled={isLoading}
                    aria-label={`OTP digit ${index + 1}`}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg border text-center text-xl sm:text-2xl font-bold outline-none transition-all duration-200 ${
                      digit
                        ? "border-orange-400 bg-orange-50 text-orange-600"
                        : "border-gray-200 bg-white text-gray-900"
                    } focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:opacity-60`}
                  />
                ))}
              </div>
            </div>

            {/* Verify button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className="mt-8 w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm sm:text-base font-bold text-white shadow-md shadow-orange-100 hover:bg-orange-600 active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin" size={19} />
                  Verifying...
                </>
              ) : (
                <>
                  <FiCheckCircle size={19} />
                  Verify Email
                </>
              )}
            </button>

            {/* Resend OTP */}
            <div className="mt-7 text-center">
              <p className="text-sm text-gray-500">Didn't receive the code?</p>

              <button
                type="button"
                disabled={timer > 0 || isResending || !email}
                onClick={resendOtp}
                className={`mt-2 inline-flex items-center justify-center gap-2 text-sm font-bold transition-colors ${
                  timer === 0 && !isResending && email
                    ? "text-orange-600 hover:text-orange-700"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {isResending ? (
                  <>
                    <FiLoader className="animate-spin" size={15} />
                    Sending...
                  </>
                ) : timer > 0 ? (
                  <>
                    <FiRefreshCw size={15} />
                    Resend code in {timer}s
                  </>
                ) : (
                  <>
                    <FiRefreshCw size={15} />
                    Resend OTP
                  </>
                )}
              </button>
            </div>

            {/* Back to login */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-8 mx-auto flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 hover:text-orange-600 transition-colors"
            >
              <FiArrowLeft size={15} />
              Back to Login
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Your account security matters to us.
        </p>
      </div>
    </main>
  );
};

export default VerifyOtp;
