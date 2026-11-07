import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import { FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-14 my-10 mt-40 text-m">
        <div
          className="mb-5 w-32"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Link to="/">
            <img
              src={assets.logo}
              className="w-36 py-5"
              alt="assets.logo_img1"
            />
          </Link>
          <p className="w-full md:w-40 text-gray-600">
            BaltiMart is your trusted online shopping destination in Baltistan,
            bringing quality products right to your doorstep. Shop easily,
            explore a wide range of products, and enjoy a convenient shopping
            experience from anywhere in the region.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">Get In Touch</p>
          <ul className="flex flex-col gap-3 text-gray-600">
            <li>
              <a
                href="https://wa.me/923412996639"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-600 transition-all"
              >
                <FaWhatsapp className="text-green-500" />
                +92 3412996639
              </a>
            </li>

            <li>
              <a
                href="mailto:lateef4262@gmail.com"
                className="flex items-center gap-2 hover:text-blue-600 transition-all"
              >
                <FaEnvelope />
                lateef4262@gmail.com
              </a>
            </li>

            <li>
              <a
                href="https://wa.me/923467161715"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-600 transition-all"
              >
                <FaWhatsapp className="text-green-500" />
                +92 3467161715
              </a>
            </li>

            <li>
              <a
                href="mailto:zeeshanlahari786@gmail.com"
                className="flex items-center gap-2 hover:text-blue-600 transition-all"
              >
                <FaEnvelope />
                zeeshanlahari786@gmail.com
              </a>
            </li>

            <li>
              <a
                href="https://wa.me/923555400378"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-600 transition-all"
              >
                <FaWhatsapp className="text-green-500" />
                +92 3555400378
              </a>
            </li>

            <li>
              <a
                href="mailto:asku0019@gmail.com"
                className="flex items-center gap-2 hover:text-blue-600 transition-all"
              >
                <FaEnvelope />
                asku0019@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <div className="flex justify-center gap-6 py-4 text-sm text-gray-600">
          <Link to="/privacy-policy" className="hover:text-black">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:text-black">
            Terms of Service
          </Link>
        </div>
        <p className="py-5 text-sm text-center">
          Copyright 2025@ BaltiMart.com - All Right Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
