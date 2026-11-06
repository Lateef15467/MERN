import React, { useEffect, useState } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiShoppingBag, FiStar } from "react-icons/fi";

const Hero = () => {
  const heroImages = [
    assets.hero,
    assets.hero1,
    assets.hero2,
    assets.hero3,
    assets.hero4,
    assets.hero5,
    assets.hero6,
    assets.hero7,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative mt-5 min-h-[520px] overflow-hidden rounded-[30px] bg-[#F7F3EC]">
      {/* Decorative Shapes */}
      <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-orange-200/50 blur-2xl" />
      <div className="absolute bottom-0 right-[25%] h-40 w-40 rounded-full bg-yellow-200/40 blur-3xl" />

      <div className="relative grid min-h-[520px] grid-cols-1 items-center lg:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="z-10 px-7 py-12 sm:px-12 lg:py-16 lg:pl-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-xs font-bold uppercase tracking-[2px] text-gray-600">
              Your Local Online Marketplace
            </span>
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-[1.08] tracking-tight text-[#202020] sm:text-6xl lg:text-[68px]">
            Shop More.
            <br />
            <span className="text-orange-500">Live Better.</span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-7 text-gray-600 sm:text-base">
            From everyday essentials to fashion, electronics and more, discover
            everything in one place. BaltiMart brings convenient online shopping
            closer to every home in Baltistan.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/collection"
              className="group inline-flex items-center gap-3 rounded-xl bg-[#202020] px-7 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500"
            >
              <FiShoppingBag size={18} />
              Explore Collection
              <FiArrowUpRight
                size={19}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <Link
              to="/about"
              className="text-sm font-bold text-gray-700 underline decoration-orange-400 decoration-2 underline-offset-4 transition hover:text-orange-500"
            >
              About BaltiMart
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#F7F3EC] bg-orange-400 text-xs font-bold text-white">
                B
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#F7F3EC] bg-gray-800 text-xs font-bold text-white">
                M
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#F7F3EC] bg-yellow-500 text-xs font-bold text-white">
                +
              </span>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-bold text-gray-800">
                <FiStar className="fill-orange-400 text-orange-400" />
                Shopping Made Simple
              </p>
              <p className="text-xs text-gray-500">
                Your needs, all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE AREA */}
        <div className="relative flex min-h-[350px] items-center justify-center px-5 pb-12 lg:min-h-[520px] lg:px-8 lg:py-10">
          {/* Large Decorative Circle */}
          <div className="absolute right-0 top-1/2 h-[340px] w-[340px] -translate-y-1/2 rounded-full bg-[#F2B65D] sm:h-[420px] sm:w-[420px] lg:right-[-30px] lg:h-[480px] lg:w-[480px]" />

          {/* Image Slider */}
          <div className="relative z-10 w-full max-w-[510px]">
            <div className="overflow-hidden rounded-[35px]">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {heroImages.map((img, index) => (
                  <div
                    key={index}
                    className="flex min-w-full items-center justify-center"
                  >
                    <img
                      src={img}
                      alt={`BaltiMart products ${index + 1}`}
                      className="h-[300px] w-full object-contain drop-shadow-2xl sm:h-[390px] lg:h-[430px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Shopping Label */}
            <div className="absolute -left-2 top-8 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-left-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                <FiShoppingBag size={21} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Shop Your Way</p>
                <p className="text-[10px] text-gray-500">Anytime, Anywhere</p>
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === index
                      ? "w-7 bg-orange-500"
                      : "w-2 bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
