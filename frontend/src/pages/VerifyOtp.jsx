import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef([]);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email");

  const { setUser, settoken } = useContext(ShopContext);

  /* ------------------- OTP Input Handler ------------------- */
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* -------------------- Countdown Timer -------------------- */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* -------------------- Verify OTP -------------------- */
  const handleVerify = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return toast.error("Enter complete 6-digit OTP");
    }

    if (!email) {
      return toast.error("Email is missing. Please sign up again.");
    }

    try {
      setIsLoading(true);

      // Step 1: Verify OTP
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/verify-otp",
        { email, otp: finalOtp },
      );

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

        const loginRes = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/user/login",
          {
            email,
            password: savedPassword,
          },
        );

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

  /* -------------------------- Resend OTP ------------------------- */
  const resendOtp = async () => {
    if (timer > 0 || !email) return;

    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/user/resend-otp",
        { email },
      );

      toast.success("OTP sent again!");
      setOtp(["", "", "", "", "", ""]);
      setTimer(30);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-gray-50 px-3 py-8 sm:px-6 sm:py-12">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-md rounded-2xl bg-white px-4 py-8 shadow-xl sm:px-8 sm:py-10 animate-fadeIn"
      >
        {/* Heading */}
        <h1 className="mb-3 text-center text-2xl font-semibold text-gray-800 sm:text-3xl">
          Verify Your Email
        </h1>

        <p className="mb-7 text-center text-xs leading-6 text-gray-600 sm:text-sm">
          We’ve sent a 6-digit verification code to
          <br />
          <strong className="break-all text-black">
            {email || "Your email"}
          </strong>
        </p>

        {/* OTP INPUTS */}
        <div className="mb-7 flex w-full items-center justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              aria-label={`OTP digit ${index + 1}`}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className="h-11 min-w-0 w-full max-w-[44px] rounded-lg border border-gray-300 text-center text-lg font-semibold outline-none transition-all focus:border-black focus:ring-2 focus:ring-black sm:h-14 sm:max-w-[50px] sm:rounded-xl sm:text-2xl"
            />
          ))}
        </div>

        {/* VERIFY BUTTON */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full rounded-xl bg-black py-3 text-base font-medium text-white transition-all sm:py-3.5 sm:text-lg ${
            isLoading
              ? "cursor-not-allowed opacity-70"
              : "hover:bg-gray-900 active:scale-[0.98]"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* RESEND OTP */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1 text-center text-xs text-gray-600 sm:text-sm">
          <span>Didn’t receive the code?</span>

          <button
            type="button"
            disabled={timer > 0}
            onClick={resendOtp}
            className={`font-semibold ${
              timer === 0
                ? "cursor-pointer text-black hover:underline"
                : "cursor-not-allowed text-gray-400"
            }`}
          >
            {timer === 0 ? "Resend OTP" : `Resend in ${timer}s`}
          </button>
        </div>
      </form>

      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-in-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default VerifyOtp;
