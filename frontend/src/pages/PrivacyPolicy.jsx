import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-sm leading-7 text-gray-700">
      <h1 className="mb-2 text-3xl font-semibold text-gray-900">
        Privacy Policy
      </h1>
      <p className="mb-8 text-gray-500">Last updated: November 2026</p>

      <p className="mb-6">
        BaltiMart ("we", "our") is an online shop available at
        https://baltimart.vercel.app. This policy explains what information we
        collect and how we use it.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold text-gray-900">
        Information we collect
      </h2>
      <ul className="mb-6 list-disc pl-6">
        <li>
          Account details: your name and email address, and a password if you
          register with email.
        </li>
        <li>
          If you choose "Sign in with Google", we receive your Google name and
          email address from Google. We do not receive your Google password and
          we do not access any other Google data.
        </li>
        <li>
          Order details: delivery address, phone number, items ordered and
          payment method.
        </li>
        <li>Product reviews and ratings that you submit.</li>
      </ul>

      <h2 className="mb-2 mt-8 text-lg font-semibold text-gray-900">
        How we use your information
      </h2>
      <ul className="mb-6 list-disc pl-6">
        <li>To create and secure your account and log you in.</li>
        <li>To process, deliver and track your orders.</li>
        <li>To show your reviews on product pages.</li>
        <li>To contact you about your account or orders.</li>
      </ul>

      <h2 className="mb-2 mt-8 text-lg font-semibold text-gray-900">Sharing</h2>
      <p className="mb-6">
        We do not sell your personal information. We share it only with services
        needed to run the shop, such as payment providers and delivery, and only
        as required for your order.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold text-gray-900">
        Storage and security
      </h2>
      <p className="mb-6">
        Your data is stored in our database and protected with reasonable
        technical measures. Passwords are stored in hashed form.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold text-gray-900">
        Your choices
      </h2>
      <p className="mb-6">
        You can ask us to access, correct or delete your account data at any
        time by contacting us at the email below.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-semibold text-gray-900">Contact</h2>
      <p>Email: YOUR_SUPPORT_EMAIL@gmail.com</p>
    </div>
  );
};

export default PrivacyPolicy;
