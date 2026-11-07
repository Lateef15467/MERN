import React, { useEffect } from "react";
import { Link } from "react-router-dom";

// ====== EDIT THIS ======
const SITE_NAME = "BaltiMart";
const SITE_URL = "https://baltimart.vercel.app";
const EMAIL = " lateef4262@gmail.com";
const LAST_UPDATED = "7 November 2026";
// =======================

const Section = ({ title, children }) => (
  <section className="mt-8">
    <h2 className="mb-2 text-lg font-semibold text-gray-900">{title}</h2>
    {children}
  </section>
);

const P = ({ children }) => <p className="mb-3">{children}</p>;

const UL = ({ children }) => (
  <ul className="mb-3 list-disc space-y-1 pl-6">{children}</ul>
);

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-sm leading-7 text-gray-700 sm:py-14">
      <h1 className="text-3xl font-semibold text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-gray-500">Last updated: {LAST_UPDATED}</p>

      <div className="mt-6">
        <P>
          {SITE_NAME} ({SITE_URL}) is a small online shopping website for
          Baltistan. This page explains what information we collect and how we
          use it. By using the website you agree to this policy.
        </P>
      </div>

      <Section title="Information we collect">
        <UL>
          <li>Your name and email address when you create an account.</li>
          <li>
            A password, if you register with email. Passwords are stored in
            hashed form.
          </li>
          <li>
            Order details such as the items you order, your delivery name,
            address and phone number.
          </li>
          <li>Reviews and ratings that you post.</li>
        </UL>
      </Section>

      <Section title="Google sign-in">
        <P>
          You can log in with Google. When you do, Google gives us your name and
          email address. We use them only to create your account and log you in.
          We do not get your Google password and we do not access any other
          Google data.
        </P>
        <P>
          We do not sell Google user data, and we do not use it for advertising.{" "}
          {SITE_NAME}’s use of information received from Google APIs follows the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-black"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </P>
      </Section>

      <Section title="How we use information">
        <UL>
          <li>To create your account and let you log in.</li>
          <li>To handle and deliver your orders.</li>
          <li>To contact you about your account or orders.</li>
          <li>To show your reviews on product pages.</li>
        </UL>
      </Section>

      <Section title="Sharing">
        <P>
          We do not sell your personal information. We may share the details
          needed for an order with delivery and payment providers, and we use
          hosting and storage services to run the website. We may also share
          information if the law requires it.
        </P>
      </Section>

      <Section title="Storage on your device">
        <P>
          To keep you logged in, the website saves a login token and basic
          account details in your browser. Logging out removes them.
        </P>
      </Section>

      <Section title="Security">
        <P>
          We take reasonable steps to protect your information, but no website
          can be completely secure.
        </P>
      </Section>

      <Section title="Your choices">
        <P>
          You can ask us to correct or delete your account information by
          emailing {EMAIL}. You can also delete your own reviews on the product
          page.
        </P>
      </Section>

      <Section title="Children">
        <P>This website is not meant for children under 18.</P>
      </Section>

      <Section title="Changes">
        <P>
          We may update this policy from time to time. The date at the top shows
          the latest update.
        </P>
      </Section>

      <Section title="Contact">
        <P>
          Questions? Email us at{""}
          <a href={`mailto:${EMAIL}`} className="underline hover:text-black">
            {EMAIL}
          </a>
          .
        </P>
      </Section>

      <div className="mt-10 flex gap-5 border-t pt-6 text-xs text-gray-500">
        <Link
          to="/terms-of-service"
          className="hover:text-black hover:underline"
        >
          Terms of Service
        </Link>
        <Link to="/" className="hover:text-black hover:underline">
          Back to shop
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
