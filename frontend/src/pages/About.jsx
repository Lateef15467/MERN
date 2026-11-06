import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from "../components/NewsLetter";
import { FaShieldAlt, FaSmile, FaShoppingBag } from "react-icons/fa";

const About = () => {
  return (
    <div className="animate-fadeIn">
      {/* About Us Title */}
      <div className="text-xl text-center pt-10 border-t border-gray-200 font-semibold">
        <Title text1={"About"} text2={" Us"} />
      </div>

      {/* About Content */}
      <div className="my-16 flex flex-col md:flex-row gap-12 items-center px-6 md:px-12">
        {/* Image */}
        <div className="relative group">
          <img
            src={assets.about_img}
            className="w-full md:max-w-[450px] rounded-2xl shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl"
            alt="About BaltiMart"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500"></div>
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600 leading-relaxed">
          <p>
            Welcome to <b className="text-black">BaltiMart</b> — a local online
            shopping platform designed to bring a convenient and modern shopping
            experience to the people of Baltistan. We bring a variety of
            products together in one place, making it easier to discover and
            shop for everyday needs without the hassle of visiting multiple
            stores.
          </p>

          <p>
            From everyday essentials to fashion, electronics, home accessories,
            and much more, BaltiMart aims to make online shopping accessible,
            reliable, and affordable. With a focus on trusted service, quality
            products, and free delivery, we want every customer to shop with
            confidence and convenience.
          </p>

          <div>
            <b className="text-gray-800 text-lg">Our Mission</b>
            <p className="mt-2">
              Our mission is to simplify shopping across Baltistan through
              technology. We aim to connect customers with a wide range of
              products, support convenient online purchasing, and bring shopping
              closer to every doorstep while building trust and long-term
              relationships with our community.
            </p>
          </div>

          {/* Call-to-Action */}
          <button
            onClick={() => (window.location.href = "/collection")}
            className="mt-4 w-fit border border-black px-8 py-3 text-sm font-medium rounded-full hover:bg-black hover:text-white transition-all duration-500 hover:shadow-[0_0_12px_rgba(0,0,0,0.3)]"
          >
            Explore Products
          </button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-center my-20 px-6">
        <Title text1={"Why"} text2={" Choose Us"} />
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          At <b>BaltiMart</b>, we believe shopping should be simple, affordable,
          and reliable. We are committed to bringing a better online shopping
          experience to the people of Baltistan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Quality Assurance */}
          <div className="border rounded-2xl px-8 py-10 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center gap-5">
            <FaShieldAlt className="text-4xl text-black" />
            <b className="text-lg">Trusted Shopping</b>
            <p className="text-gray-600 text-sm text-center leading-relaxed">
              Your trust matters to us. We focus on reliable service, product
              quality, and a transparent shopping experience with every order.
            </p>
          </div>

          {/* Convenience */}
          <div className="border rounded-2xl px-8 py-10 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center gap-5">
            <FaShoppingBag className="text-4xl text-black" />
            <b className="text-lg">Shopping Made Easy</b>
            <p className="text-gray-600 text-sm text-center leading-relaxed">
              Explore a variety of products in one place, order from anywhere,
              and enjoy the convenience of online shopping from your home.
            </p>
          </div>

          {/* Customer Service */}
          <div className="border rounded-2xl px-8 py-10 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center gap-5">
            <FaSmile className="text-4xl text-black" />
            <b className="text-lg">Customer Satisfaction</b>
            <p className="text-gray-600 text-sm text-center leading-relaxed">
              Every customer matters. We strive to provide helpful support,
              convenient delivery, and a shopping experience you can rely on.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsLetter />
    </div>
  );
};

export default About;
