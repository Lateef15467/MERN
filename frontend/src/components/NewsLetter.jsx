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
    <div className="text-center bg-gradient-to-b from-gray-50 to-white py-10 sm:py-14 px-4 sm:px-6">
      {/* Heading: icon stacks above the text on phones */}
      <p className="text-2xl sm:text-3xl font-semibold text-gray-800 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
        <FaEnvelope className="text-[#0a2540] text-3xl shrink-0" />
        <span>
          Subscribe now & get <span className="text-[#ff7b00]">50% off</span>
        </span>
      </p>

      <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
        Join our community and be the first to know about{" "}
        <b>exclusive deals, new arrivals,</b> and <b>special offers</b>. Sign up
        today and enjoy <b>50% off</b> your first purchase. Shop smarter with{" "}
        <i>BaltiMart</i>!
      </p>

      {!submitted ? (
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-lg mx-auto my-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:border sm:border-gray-300 sm:bg-white sm:rounded-full sm:shadow-sm sm:hover:shadow-md transition-all duration-300 sm:px-3"
        >
          {/* Email field */}
          <div className="flex flex-1 min-w-0 items-center gap-2 bg-white border border-gray-300 rounded-full px-4 shadow-sm sm:border-0 sm:shadow-none sm:bg-transparent sm:px-0 sm:pl-2">
            <FaEnvelope className="text-gray-400 text-lg shrink-0" />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-w-0 py-3 px-1 outline-none bg-transparent text-gray-700 text-base"
              required
            />
          </div>

          {/* Button: full width on phones, normal size on larger screens */}
          <button
            type="submit"
            className="w-full sm:w-auto justify-center whitespace-nowrap bg-[#0a2540] hover:bg-[#ff7b00] text-white flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full transition-all duration-300"
          >
            <FaPaperPlane className="text-white" />
            Subscribe
          </button>
        </form>
      ) : (
        <div className="text-[#0a2540] font-medium text-base sm:text-lg flex flex-col items-center mt-8 px-2">
          <FaPaperPlane className="text-[#ff7b00] text-3xl mb-2 animate-bounce" />
          Thank you for subscribing! <br />
          You’ll receive exclusive deals in your inbox soon.
        </div>
      )}
    </div>
  );
};

export default NewsLetter;
