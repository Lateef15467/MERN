import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import { FaWhatsapp, FaEnvelope, FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const contacts = [
    {
      type: "whatsapp",
      value: "+92 3412996639",
      href: "https://wa.me/923412996639",
    },
    {
      type: "email",
      value: "lateef4262@gmail.com",
      href: "mailto:lateef4262@gmail.com",
    },
    {
      type: "whatsapp",
      value: "+92 3467161715",
      href: "https://wa.me/923467161715",
    },
    {
      type: "email",
      value: "zeeshanlahari786@gmail.com",
      href: "mailto:zeeshanlahari786@gmail.com",
    },
    {
      type: "whatsapp",
      value: "+92 3555400378",
      href: "https://wa.me/923555400378",
    },
    {
      type: "email",
      value: "asku0019@gmail.com",
      href: "mailto:asku0019@gmail.com",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-20 border-t border-gray-100 bg-white text-gray-800">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          {/* Brand Section */}
          <div>
            <Link to="/" onClick={scrollToTop} className="inline-block">
              <img
                src={assets.logo}
                alt="BaltiMart Logo"
                className="mb-5 w-36 object-contain"
              />
            </Link>

            <p className="max-w-sm text-sm leading-7 text-gray-500">
              From everyday essentials to fashion, electronics and more,
              discover everything in one place. BaltiMart brings convenient
              online shopping closer to every home in Baltistan.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">
                Your local online shopping destination
              </span>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Get In Touch
            </h3>

            <div className="mb-5 h-1 w-10 rounded-full bg-green-500" />

            <ul className="flex flex-col gap-4">
              {contacts.map((contact, index) => (
                <li key={index}>
                  <a
                    href={contact.href}
                    target={contact.type === "whatsapp" ? "_blank" : undefined}
                    rel={
                      contact.type === "whatsapp"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group flex items-center gap-3 text-sm text-gray-500 transition-colors hover:text-gray-900"
                  >
                    <span
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                        contact.type === "whatsapp"
                          ? "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white"
                          : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                      }`}
                    >
                      {contact.type === "whatsapp" ? (
                        <FaWhatsapp size={17} />
                      ) : (
                        <FaEnvelope size={15} />
                      )}
                    </span>

                    <span className="break-all">{contact.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Quick Links
            </h3>

            <div className="mb-5 h-1 w-10 rounded-full bg-green-500" />

            <ul className="flex flex-col gap-4 text-sm text-gray-500">
              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="transition-colors hover:text-green-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/collection"
                  className="transition-colors hover:text-green-600"
                >
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="transition-colors hover:text-green-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-green-600"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="transition-colors hover:text-green-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="transition-colors hover:text-green-600"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <p className="text-center text-xs leading-6 text-gray-500 sm:text-left">
              © {new Date().getFullYear()} BaltiMart.com. All Rights Reserved.
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition-all hover:border-green-500 hover:bg-green-50 hover:text-green-700"
            >
              Back to top
              <FaArrowUp size={11} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
