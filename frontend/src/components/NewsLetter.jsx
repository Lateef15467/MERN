import React, { useState } from "react";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Simulate backend submission
    setTimeout(() => {
      setSubmitted(true);
      setEmail("");
    }, 800);
  };

  return (
    <section className="my-12 px-4 sm:my-16 sm:px-6 lg:my-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-gray-100 bg-white px-5 py-10 shadow-sm sm:rounded-3xl sm:px-10 sm:py-14 lg:px-16">
        {/* Decorative Elements */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative z-10 text-center">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0a2540] text-white shadow-md shadow-blue-900/10">
            <FaEnvelope size={23} />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Subscribe now & get <span className="text-[#ff7b00]">50% off</span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-gray-500 sm:text-sm sm:leading-7 md:text-base">
            Join our community and be the first to know about{" "}
            <span className="font-semibold text-gray-700">
              exclusive deals, new arrivals,
            </span>{" "}
            and{" "}
            <span className="font-semibold text-gray-700">special offers.</span>{" "}
            Sign up today and enjoy <b>50% off</b> your first purchase. Shop
            smarter with <i>BaltiMart</i>!
          </p>

          {/* Subscription Form */}
          {!submitted ? (
            <form
              onSubmit={onSubmitHandler}
              className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:border sm:border-gray-200 sm:bg-white sm:p-1.5 sm:shadow-sm sm:transition-shadow sm:focus-within:border-[#0a2540] sm:focus-within:shadow-md"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 transition-colors focus-within:border-[#0a2540] sm:border-0 sm:bg-transparent sm:px-4">
                <FaEnvelope className="flex-shrink-0 text-gray-400" />

                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-w-0 bg-transparent py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 sm:py-3"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex min-h-[48px] w-full flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0a2540] px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#ff7b00] active:scale-[0.98] sm:w-auto sm:rounded-full"
              >
                <FaPaperPlane size={14} />
                Subscribe Now
              </button>
            </form>
          ) : (
            <div
              role="status"
              className="mx-auto mt-9 flex max-w-lg flex-col items-center rounded-2xl border border-green-100 bg-green-50 px-5 py-6"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#ff7b00] shadow-sm">
                <FaPaperPlane size={21} />
              </div>

              <h3 className="text-base font-bold text-[#0a2540] sm:text-lg">
                Thank you for subscribing!
              </h3>

              <p className="mt-2 text-xs leading-6 text-gray-600 sm:text-sm">
                You’ll receive exclusive deals in your inbox soon.
              </p>
            </div>
          )}

          {/* Small Trust Text */}
          <p className="mt-5 text-[11px] text-gray-400 sm:text-xs">
            Stay updated with the latest BaltiMart offers and collections.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
