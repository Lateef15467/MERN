import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  // Calculated during render (not in an effect), so the grid is present on
  // the very first paint and the page height never jumps when coming Back
  const bestseller = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products.filter((item) => item.bestseller).slice(0, 5);
  }, [products]);

  return (
    <section className="my-14 sm:my-16 lg:my-20">
      {/* Section Heading */}
      <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-4">
        <div className="mb-3">
          <Title text1={"BEST"} text2={" SELLERS"} />
        </div>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed text-gray-500">
          Discover our most-loved products chosen by customers like you. Explore
          trending styles and everyday essentials, carefully selected for
          quality, comfort, and value.
        </p>
      </div>

      {/* Products Grid */}
      {bestseller.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9">
          {bestseller.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              inStock={item.inStock}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-400">
            No best-selling products available right now.
          </p>
        </div>
      )}
    </section>
  );
};

export default BestSeller;
