import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from "../components/NewsLetter";
import { FaShieldAlt, FaSmile, FaShoppingBag } from "react-icons/fa";

const About = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Trusted Shopping",
      description:
        "Your trust matters to us. We focus on reliable service, product quality, and a transparent shopping experience with every order.",
    },
    {
      icon: <FaShoppingBag />,
      title: "Shopping Made Easy",
      description:
        "Explore a variety of products in one place, order from anywhere, and enjoy the convenience of online shopping from your home.",
    },
    {
      icon: <FaSmile />,
      title: "Customer Satisfaction",
      description:
        "Every customer matters. We strive to provide helpful support, convenient delivery, and a shopping experience you can rely on.",
    },
  ];

  return (
    <div className="overflow-hidden bg-white">
      {/* About Us Heading */}
      <section className="border-t border-gray-100 px-4 pb-3 pt-10 text-center sm:pt-14">
        <Title text1="About" text2=" Us" />
        <p className="mx-auto mt-1 max-w-xl text-xs leading-6 text-gray-500 sm:text-sm">
          Discover the story behind BaltiMart and our commitment to making
          shopping easier across Baltistan.
        </p>
      </section>

      {/* About Content */}
      <section className="mx-auto my-12 flex max-w-7xl flex-col items-center gap-9 px-4 sm:my-16 sm:px-8 md:flex-row md:gap-12 lg:gap-16 lg:px-12">
        {/* About Image */}
        <div className="group relative w-full md:w-1/2">
          <div className="absolute -bottom-3 -right-3 h-full w-full rounded-2xl bg-orange-100" />

          <img
            src={assets.about_img}
            alt="About BaltiMart"
            loading="lazy"
            className="relative z-10 aspect-[5/4] w-full rounded-2xl object-cover shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
          />

          <div className="absolute left-4 top-4 z-20 rounded-lg bg-white/95 px-4 py-2 shadow-md sm:left-6 sm:top-6">
            <p className="text-xs font-bold tracking-wide text-orange-600">
              BALTIMART
            </p>
            <p className="text-[10px] text-gray-500">Shopping made easier</p>
          </div>
        </div>

        {/* About Text */}
        <div className="flex w-full flex-col justify-center gap-5 text-sm leading-7 text-gray-600 md:w-1/2 sm:text-base">
          <div>
            <span className="mb-2 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
              Who We Are
            </span>

            <h2 className="mb-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              Bringing Shopping Closer to You
            </h2>

            <p>
              Welcome to <b className="text-gray-900">BaltiMart</b> — a local
              online shopping platform designed to bring a convenient and modern
              shopping experience to the people of Baltistan. We bring a variety
              of products together in one place, making it easier to discover
              and shop for everyday needs without the hassle of visiting
              multiple stores.
            </p>
          </div>

          <p>
            From everyday essentials to fashion, electronics, home accessories,
            and much more, BaltiMart aims to make online shopping accessible,
            reliable, and affordable. With a focus on trusted service, quality
            products, and free delivery, we want every customer to shop with
            confidence and convenience.
          </p>

          {/* Mission */}
          <div className="rounded-xl border-l-4 border-orange-500 bg-orange-50/70 p-4 sm:p-5">
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              Our Mission
            </h3>

            <p className="text-sm leading-6 text-gray-600">
              Our mission is to simplify shopping across Baltistan through
              technology. We aim to connect customers with a wide range of
              products, support convenient online purchasing, and bring shopping
              closer to every doorstep while building trust and long-term
              relationships with our community.
            </p>
          </div>

          {/* Explore Button */}
          <button
            onClick={() => (window.location.href = "/collection")}
            className="mt-2 w-full rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-orange-600 hover:shadow-md sm:w-fit"
          >
            Explore Products
            <span className="ml-2">→</span>
          </button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <Title text1="Why" text2=" Choose Us" />

            <h2 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
              Why Shop With BaltiMart?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-gray-500 sm:text-sm">
              At <b className="text-gray-700">BaltiMart</b>, we believe shopping
              should be simple, affordable, and reliable. We are committed to
              bringing a better online shopping experience to the people of
              Baltistan.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white px-6 py-9 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg sm:px-8"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-2xl text-orange-500 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                  {feature.icon}
                </div>

                <h3 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
                  {feature.title}
                </h3>

                <p className="text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>

                <div className="mt-6 h-1 w-10 rounded-full bg-orange-400 transition-all duration-300 group-hover:w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <div className="py-10 sm:py-14">
        <NewsLetter />
      </div>
    </div>
  );
};

export default About;
