import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

// Randomly shuffle products
const shuffleProducts = (products) => {
  const shuffled = [...products];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

const LatestCollection = () => {
  const { products } = useContext(ShopContext);

  // Randomly select 10 products
  const latestProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return shuffleProducts(products).slice(0, 10);
  }, [products]);

  return (
    <section className="my-14 sm:my-16 lg:my-20">
      {/* Section Heading */}
      <div className="mb-8 px-3 text-center sm:mb-10 sm:px-5 lg:mb-12">
        <div className="mb-3">
          <Title text1={"LATEST"} text2={" COLLECTIONS"} />
        </div>

        <p className="mx-auto max-w-2xl text-xs leading-6 text-gray-500 sm:text-sm sm:leading-7 md:text-base">
          From our mountains to your doorstep! Discover more, shop smarter, and
          enjoy trusted quality with free delivery across Baltistan. Your local
          shopping destination,{" "}
          <span className="font-semibold text-gray-800">BaltiMart.</span>
        </p>
      </div>

      {/* Products Grid */}
      {latestProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 md:grid-cols-4 lg:grid-cols-5">
          {latestProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              inStock={item.inStock}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-400">
            No products available at the moment.
          </p>
        </div>
      )}
    </section>
  );
};

export default LatestCollection;
