import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from "../components/NewsLetter";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
  FaPaperPlane,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="animate-fadeIn bg-gradient-to-b from-gray-50 to-white">
      {/* Page Title */}
      <div className="text-center text-xl font-semibold pt-10 border-t border-gray-200">
        <Title text1={"Contact"} text2={" Us"} />
        <p className="text-gray-500 text-sm mt-2">
          Have a question or need assistance? We're always happy to help!
        </p>
      </div>

      {/* Contact Section */}
      <div className="my-16 flex flex-col md:flex-row justify-center items-center gap-12 px-6">
        {/* Image */}
        <div className="relative group">
          <img
            src={assets.contact_img}
            className="w-full md:max-w-[480px] rounded-2xl shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl"
            alt="Contact BaltiMart"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-15 rounded-2xl transition-opacity duration-500"></div>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col justify-center items-start gap-6 max-w-lg bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500">
          <h2 className="font-semibold text-3xl text-gray-700 flex items-center gap-3">
            <FaMapMarkerAlt className="text-[#0B132B]" />
            Our Location
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Based in Toq Olding, Skardu, Baltistan. Our goal is to make online
            shopping easier and more accessible for customers throughout the
            region.
          </p>

          <div className="w-full">
            <h3 className="font-semibold text-xl text-gray-700 mb-4">
              Get In Touch
            </h3>

            <div className="flex flex-col gap-4 text-gray-600">
              <div>
                <p className="font-medium text-gray-800 mb-2">
                  Customer Support
                </p>

                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="text-[#0B132B]" />
                  <a href="tel:+923412996639" className="hover:text-[#FCA311]">
                    +92 3412996639
                  </a>
                </p>

                <p className="flex items-center gap-2 mt-2">
                  <FaEnvelope className="text-[#0B132B]" />
                  <a
                    href="mailto:lateef4262@gmail.com"
                    className="hover:text-[#FCA311]"
                  >
                    lateef4262@gmail.com
                  </a>
                </p>
              </div>

              <div className="border-t pt-3">
                <p className="font-medium text-gray-800 mb-2">
                  General Inquiries
                </p>

                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="text-[#0B132B]" />
                  <a href="tel:+923555400378" className="hover:text-[#FCA311]">
                    +92 3555400378
                  </a>
                </p>

                <p className="flex items-center gap-2 mt-2">
                  <FaEnvelope className="text-[#0B132B]" />
                  <a
                    href="mailto:asku0019@gmail.com"
                    className="hover:text-[#FCA311]"
                  >
                    asku0019@gmail.com
                  </a>
                </p>
              </div>

              <div className="border-t pt-3">
                <p className="font-medium text-gray-800 mb-2">
                  Additional Contact
                </p>

                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="text-[#0B132B]" />
                  <a href="tel:+923467161715" className="hover:text-[#FCA311]">
                    +92 3467161715
                  </a>
                </p>

                <p className="flex items-center gap-2 mt-2">
                  <FaEnvelope className="text-[#0B132B]" />
                  <a
                    href="mailto:zeeshanlahari786@gmail.com"
                    className="hover:text-[#FCA311]"
                  >
                    zeeshanlahari786@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Join Our Team */}
          <div className="pt-5 border-t border-gray-200 w-full">
            <h3 className="font-semibold text-2xl text-gray-700 flex items-center gap-3 mb-3">
              <FaUsers className="text-[#0B132B]" />
              Grow With Us
            </h3>

            <p className="text-gray-600 leading-relaxed">
              At <b>BaltiMart</b>, we believe in local talent and new ideas. We
              welcome passionate students, fresh graduates, and skilled
              individuals who want to contribute to the growth of online
              shopping and digital opportunities in Baltistan.
            </p>

            <p className="mt-3 text-gray-600">
              Interested in working with us? Send your CV to:
            </p>

            <a
              href="mailto:careers@BaltiMart.com"
              className="text-[#FCA311] hover:underline"
            >
              careers@BaltiMart.com
            </a>

            <button
              onClick={() =>
                (window.location.href =
                  "mailto:careers@BaltiMart.com?subject=Career%20Opportunity%20at%20BaltiMart")
              }
              className="flex items-center gap-2 border border-[#0B132B] text-[#0B132B] px-8 py-3 mt-5 text-sm font-medium rounded-full hover:bg-[#0B132B] hover:text-[#FCA311] transition-all duration-500 hover:shadow-[0_0_15px_rgba(252,163,17,0.4)]"
            >
              <FaPaperPlane />
              Contact for Opportunities
            </button>
          </div>
        </div>
      </div>

      {/* Google Map Section */}
      <div className="px-6 mb-20">
        <p className="text-center text-2xl font-semibold text-gray-700 mb-4">
          Find Us in Skardu
        </p>

        <p className="text-center text-gray-500 text-sm mb-6">
          Visit our location in Toq Olding, Skardu, Baltistan.
        </p>

        <div className="flex justify-center">
          <iframe
            title="BaltiMart Location in Skardu"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.981496259256!2d75.63135797458883!3d35.30237425218427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38f54a23a1f6b04b%3A0x4b56dfb5931b7c74!2sGovt.%20Boys%20Degree%20College%20Skardu!5e0!3m2!1sen!2s!4v1731425000000!5m2!1sen!2s"
            width="100%"
            height="400"
            style={{
              border: 0,
              borderRadius: "15px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-200">
        <NewsLetter />
      </div>
    </div>
  );
};

export default Contact;
