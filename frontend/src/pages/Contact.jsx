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
  const contactDetails = [
    {
      title: "Customer Support",
      phone: "+92 3412996639",
      phoneLink: "tel:+923412996639",
      email: "lateef4262@gmail.com",
      emailLink: "mailto:lateef4262@gmail.com",
    },
    {
      title: "General Inquiries",
      phone: "+92 3555400378",
      phoneLink: "tel:+923555400378",
      email: "asku0019@gmail.com",
      emailLink: "mailto:asku0019@gmail.com",
    },
    {
      title: "Additional Contact",
      phone: "+92 3467161715",
      phoneLink: "tel:+923467161715",
      email: "zeeshanlahari786@gmail.com",
      emailLink: "mailto:zeeshanlahari786@gmail.com",
    },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Page Heading */}
      <section className="border-t border-gray-100 bg-gradient-to-b from-orange-50/60 to-white px-4 pt-12 pb-8 sm:pt-16 sm:pb-10">
        <div className="mx-auto max-w-7xl text-center">
          <Title text1="Contact" text2=" Us" />

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            Have a question or need assistance? We're always happy to help. Get
            in touch with the BaltiMart team.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Contact Image */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
            <img
              src={assets.contact_img}
              alt="Contact BaltiMart"
              className="h-[280px] w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-[380px] lg:h-full lg:min-h-[650px]"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-7 pt-20 sm:px-8">
              <p className="text-sm font-medium text-orange-300">
                We're here to help
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Let's Stay Connected
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-200">
                Your questions and feedback help us make online shopping better
                for everyone in Baltistan.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col gap-6">
            {/* Location Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FCA311]">
                  <FaMapMarkerAlt size={21} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#FCA311]">
                    Visit Us
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-gray-800 sm:text-2xl">
                    Our Location
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
                Based in{" "}
                <span className="font-semibold text-gray-800">
                  Toq Olding, Skardu, Baltistan.
                </span>{" "}
                Our goal is to make online shopping easier and more accessible
                for customers throughout the region.
              </p>
            </div>

            {/* Contact Details Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-wider text-[#FCA311]">
                  We're just a message away
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-gray-800">
                  Get In Touch
                </h2>
              </div>

              <div className="space-y-5">
                {contactDetails.map((contact, index) => (
                  <div
                    key={contact.title}
                    className={`rounded-xl bg-gray-50 p-4 transition-colors duration-300 hover:bg-orange-50/60 ${
                      index !== 0 ? "border-t border-gray-100" : ""
                    }`}
                  >
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">
                      {contact.title}
                    </h3>

                    <div className="flex flex-col gap-3">
                      <a
                        href={contact.phoneLink}
                        className="flex min-w-0 items-center gap-3 text-sm text-gray-600 transition-colors hover:text-[#FCA311]"
                      >
                        <FaPhoneAlt className="shrink-0 text-[#FCA311]" />
                        <span className="break-all">{contact.phone}</span>
                      </a>

                      <a
                        href={contact.emailLink}
                        className="flex min-w-0 items-center gap-3 text-sm text-gray-600 transition-colors hover:text-[#FCA311]"
                      >
                        <FaEnvelope className="shrink-0 text-[#FCA311]" />
                        <span className="break-all">{contact.email}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Careers Card */}
            <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#FCA311] shadow-sm">
                  <FaUsers size={22} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#FCA311]">
                    Be Part of Our Journey
                  </p>
                  <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">
                    Grow With Us
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-gray-600">
                At <b className="text-gray-800">BaltiMart</b>, we believe in
                local talent and new ideas. We welcome passionate students,
                fresh graduates, and skilled individuals who want to contribute
                to the growth of online shopping and digital opportunities in
                Baltistan.
              </p>

              <p className="mt-4 text-sm text-gray-600">
                Interested in working with us? Send your CV to:
              </p>

              <a
                href="mailto:careers@BaltiMart.com"
                className="mt-2 inline-block break-all text-sm font-semibold text-[#E58A00] transition-colors hover:text-[#0B132B] hover:underline"
              >
                careers@BaltiMart.com
              </a>

              <a
                href="mailto:careers@BaltiMart.com?subject=Career%20Opportunity%20at%20BaltiMart"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FCA311] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#e58f00] hover:shadow-md sm:w-auto"
              >
                <FaPaperPlane />
                Contact for Opportunities
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mb-7 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FCA311]">
            Find Our Location
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-gray-800 sm:text-3xl">
            Find Us in Skardu
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500">
            Visit our location in Toq Olding, Skardu, Baltistan.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
          <iframe
            title="BaltiMart Location in Skardu"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.981496259256!2d75.63135797458883!3d35.30237425218427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38f54a23a1f6b04b%3A0x4b56dfb5931b7c74!2sGovt.%20Boys%20Degree%20College%20Skardu!5e0!3m2!1sen!2s!4v1731425000000!5m2!1sen!2s"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* Newsletter */}
      <div className="border-t border-gray-100">
        <NewsLetter />
      </div>
    </div>
  );
};

export default Contact;
