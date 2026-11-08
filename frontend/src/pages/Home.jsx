import React from "react";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsLetter from "../components/NewsLetter";
import Hero from "../components/Hero";

const Home = () => {
  return (
    <main className="w-full overflow-hidden bg-white">
      {/* Hero Banner */}
      <Hero />

      {/* Latest Products */}
      <section className="w-full">
        <LatestCollection />
      </section>

      {/* Best Selling Products */}
      <section className="w-full">
        <BestSeller />
      </section>

      {/* Shopping Policies */}
      <section className="w-full">
        <OurPolicy />
      </section>

      {/* Newsletter Subscription */}
      <section className="w-full">
        <NewsLetter />
      </section>
    </main>
  );
};

export default Home;
