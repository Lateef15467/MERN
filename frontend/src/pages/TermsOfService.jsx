import React from "react";

const Section = ({ title, children }) => (
  <>
    <h2 className="mb-2 mt-8 text-lg font-semibold text-gray-900">{title}</h2>
    {children}
  </>
);

const TermsOfService = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-sm leading-7 text-gray-700">
      <h1 className="mb-2 text-3xl font-semibold text-gray-900">
        Terms of Service
      </h1>
      <p className="mb-8 text-gray-500">Last updated: November 2026</p>

      <p className="mb-6">
        Welcome to BaltiMart (https://baltimart.vercel.app). By creating an
        account, signing in or placing an order, you agree to these Terms. If
        you do not agree, please do not use the site.
      </p>

      <Section title="1. Your account">
        <ul className="mb-6 list-disc pl-6">
          <li>
            You can register with your email or sign in with Google. You are
            responsible for keeping your login details safe.
          </li>
          <li>
            You must give accurate information and be old enough to enter into a
            contract where you live.
          </li>
          <li>
            We may suspend or block accounts that break these Terms or misuse
            the site.
          </li>
        </ul>
      </Section>

      <Section title="2. Products and prices">
        <p className="mb-6">
          We try to show products, images, sizes and prices accurately. Prices
          are in Pakistani Rupees (Pkr). We may correct errors and may cancel an
          order if a product is out of stock or listed at a wrong price. In that
          case any payment already made will be refunded.
        </p>
      </Section>

      <Section title="3. Orders and payment">
        <ul className="mb-6 list-disc pl-6">
          <li>
            An order is accepted when we confirm it. You can follow its progress
            from the My Orders page.
          </li>
          <li>
            Payment can be made by the methods shown at checkout, such as cash
            on delivery or online payment.
          </li>
          <li>
            For cash on delivery you agree to pay the full amount when the order
            arrives.
          </li>
        </ul>
      </Section>

      <Section title="4. Delivery">
        <p className="mb-6">
          Delivery times are estimates and may change because of location,
          weather or courier delays. Please give a correct address and phone
          number. We are not responsible for delays caused by wrong details or
          events outside our control.
        </p>
      </Section>

      <Section title="5. Exchanges and refunds">
        <p className="mb-6">
          Items can be exchanged within 2 days of delivery if they are unused
          and in original condition. To request an exchange or refund, contact
          us at the email below with your order number. Refunds, where approved,
          are returned using the original payment method.
        </p>
      </Section>

      <Section title="6. Reviews and ratings">
        <ul className="mb-6 list-disc pl-6">
          <li>You may post one review per product and may delete it later.</li>
          <li>
            Reviews must be honest and must not contain abuse, hate, spam,
            personal data of others or anything illegal.
          </li>
          <li>
            You allow us to display your review and your name on the product
            page. We may remove reviews that break these rules.
          </li>
        </ul>
      </Section>

      <Section title="7. Acceptable use">
        <p className="mb-6">
          You agree not to misuse the site, attempt to access other users'
          accounts or data, interfere with the service, upload harmful code, or
          use the site for fraud.
        </p>
      </Section>

      <Section title="8. Intellectual property">
        <p className="mb-6">
          The BaltiMart name, logo, design and site content belong to BaltiMart
          or its suppliers. You may not copy or reuse them without permission.
        </p>
      </Section>

      <Section title="9. Limitation of liability">
        <p className="mb-6">
          The site is provided "as is". To the extent allowed by law, BaltiMart
          is not liable for indirect or consequential losses arising from your
          use of the site. Our total liability for any order is limited to the
          amount you paid for that order.
        </p>
      </Section>

      <Section title="10. Privacy">
        <p className="mb-6">
          How we handle your personal information is explained in our{" "}
          <a href="/privacy-policy" className="underline hover:text-black">
            Privacy Policy
          </a>
          .
        </p>
      </Section>

      <Section title="11. Changes to these Terms">
        <p className="mb-6">
          We may update these Terms from time to time. The date at the top shows
          when they were last changed. Continuing to use the site after a change
          means you accept the new Terms.
        </p>
      </Section>

      <Section title="12. Governing law">
        <p className="mb-6">
          These Terms are governed by the laws of Pakistan.
        </p>
      </Section>

      <Section title="13. Contact">
        <p>Email: YOUR_SUPPORT_EMAIL@gmail.com</p>
      </Section>
    </div>
  );
};

export default TermsOfService;
