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

  // Select a random starting image
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * 8),
  );

  // Automatic image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative mt-4 overflow-hidden rounded-2xl bg-[#F7F3EC] sm:mt-5 sm:rounded-[28px] lg:rounded-[32px]">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl sm:h-80 sm:w-80" />
      <div className="pointer-events-none absolute bottom-0 right-[25%] h-48 w-48 rounded-full bg-yellow-200/40 blur-3xl" />

      <div className="relative grid grid-cols-1 items-center lg:grid-cols-2">
        {/* LEFT CONTENT */}
        <div className="relative z-10 px-5 pb-10 pt-10 sm:px-10 sm:pb-12 sm:pt-14 lg:px-14 lg:py-16 xl:pl-16">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3.5 py-2 shadow-sm sm:mb-7 sm:px-4">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-gray-600 sm:text-xs sm:tracking-[2px]">
              Your Local Online Marketplace
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="max-w-xl text-[42px] font-black leading-[1.08] tracking-tight text-[#202020] sm:text-6xl lg:text-[58px] xl:text-[68px]">
            Shop More.
            <br />
            <span className="text-orange-500">Live Better.</span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-md text-sm leading-7 text-gray-600 sm:mt-6 sm:text-base sm:leading-8">
            BaltiMart is your trusted online shopping destination in Baltistan,
            bringing quality products right to your doorstep. Shop easily,
            explore a wide range of products, and enjoy a convenient shopping
            experience from anywhere in the region.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-4 sm:mt-8">
            <Link
              to="/collection"
              className="group inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-[#202020] px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-gray-900/10 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-500 sm:gap-3 sm:px-7 sm:text-sm"
            >
              <FiShoppingBag size={18} />
              Explore Collection
              <FiArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <Link
              to="/about"
              className="text-xs font-bold text-gray-700 underline decoration-orange-400 decoration-2 underline-offset-4 transition-colors hover:text-orange-500 sm:text-sm"
            >
              About BaltiMart
            </Link>
          </div>

          {/* Trust Section */}
          <div className="mt-8 flex items-center gap-3 sm:mt-10">
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
              <p className="flex items-center gap-1.5 text-xs font-bold text-gray-800 sm:text-sm">
                <FiStar className="fill-orange-400 text-orange-400" />
                Shopping Made Simple
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">
                Your needs, all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE SLIDER */}
        <div className="relative flex min-h-[330px] items-center justify-center px-5 pb-16 sm:min-h-[420px] sm:px-10 lg:min-h-[540px] lg:px-8 lg:py-12">
          {/* Decorative Circle */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F2B65D] sm:h-[390px] sm:w-[390px] lg:left-auto lg:right-[-35px] lg:h-[440px] lg:w-[440px] lg:translate-x-0 xl:h-[480px] xl:w-[480px]" />

          {/* Image Slider */}
          <div className="relative z-10 w-full max-w-[510px]">
            <div className="overflow-hidden rounded-[25px] sm:rounded-[35px]">
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
                      alt={`BaltiMart featured products ${index + 1}`}
                      loading={index === currentIndex ? "eager" : "lazy"}
                      className="h-[270px] w-full object-contain drop-shadow-2xl sm:h-[350px] lg:h-[410px] xl:h-[440px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Shopping Label */}
            <div className="absolute -left-1 top-5 flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-lg sm:-left-7 sm:top-8 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-500 sm:h-10 sm:w-10">
                <FiShoppingBag size={20} />
              </div>

              <div>
                <p className="text-[11px] font-bold text-gray-800 sm:text-xs">
                  Shop Your Way
                </p>
                <p className="mt-0.5 text-[9px] text-gray-500 sm:text-[10px]">
                  Anytime, Anywhere
                </p>
              </div>
            </div>

            {/* Slider Indicators */}
            <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={currentIndex === index ? "true" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "w-7 bg-orange-500"
                      : "w-2 bg-gray-400/60 hover:bg-gray-500"
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
