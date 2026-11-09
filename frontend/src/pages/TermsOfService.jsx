import React, { useEffect } from "react";
import { Link } from "react-router-dom";

// ====== EDIT THIS ======
const SITE_NAME = "BaltiMart";
const SITE_URL = "https://baltimart.vercel.app";
const EMAIL = "lateef4262@gmail.com";
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

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-sm leading-7 text-gray-700 sm:py-14">
      <h1 className="text-3xl font-semibold text-gray-900">Terms of Service</h1>
      <p className="mt-2 text-gray-500">Last updated: {LAST_UPDATED}</p>

      <div className="mt-6">
        <P>
          {SITE_NAME} ({SITE_URL}) is a small online shopping website for
          Baltistan. By using the website, creating an account or placing an
          order, you agree to these terms and to our{" "}
          <Link to="/privacy-policy" className="underline hover:text-black">
            Privacy Policy
          </Link>
          .
        </P>
      </div>

      <Section title="Your account">
        <UL>
          <li>Please give correct information when you register.</li>
          <li>
            Keep your login details private. You are responsible for activity on
            your account.
          </li>
          <li>We may suspend accounts that misuse the website.</li>
        </UL>
      </Section>

      <Section title="Products and prices">
        <P>
          We try to show products and prices correctly, but mistakes can happen.
          Product pictures may differ slightly from the real item. Prices are in
          Pakistani Rupees (Pkr) and can change at any time.
        </P>
      </Section>

      <Section title="Orders and payment">
        <P>
          Placing an order is a request to buy. We may accept, change or cancel
          an order, for example if an item is not available or an order looks
          wrong. Payment options are shown at checkout.
        </P>
      </Section>

      <Section title="Delivery">
        <P>
          Delivery times are only estimates and may change because of weather,
          roads or other reasons. Please enter a correct address and phone
          number.
        </P>
      </Section>

      <Section title="Problems with an order">
        <P>
          If something is wrong with your order, please contact us at {EMAIL}.
          We will try to help, and each case is looked at individually.
        </P>
      </Section>

      <Section title="Reviews">
        <P>
          Reviews should be honest and respectful. Please do not post abuse,
          spam or anything illegal. We may remove reviews that break these
          rules.
        </P>
      </Section>

      <Section title="Using the website">
        <P>
          Please do not misuse the website, try to access other people’s
          accounts, or interfere with how it works.
        </P>
      </Section>

      <Section title="No guarantee">
        <P>
          The website is provided as is. We cannot promise that it will always
          be available or free of errors. To the extent the law allows, we are
          not responsible for losses that come from using the website.
        </P>
      </Section>

      <Section title="Changes">
        <P>
          We may update these terms from time to time. Continuing to use the
          website means you accept the updated terms.
        </P>
      </Section>

      <Section title="Contact">
        <P>
          Questions? Email us at{" "}
          <a href={`mailto:${EMAIL}`} className="underline hover:text-black">
            {EMAIL}
          </a>
          .
        </P>
      </Section>

      <div className="mt-10 flex gap-5 border-t pt-6 text-xs text-gray-500">
        <Link to="/privacy-policy" className="hover:text-black hover:underline">
          Privacy Policy
        </Link>
        <Link to="/" className="hover:text-black hover:underline">
          Back to shop
        </Link>
      </div>
    </div>
  );
};

export default TermsOfService;
