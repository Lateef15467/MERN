import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "../components/ProductItem";

const RelatedProduct = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();

      productsCopy = productsCopy.filter((item) => category === item.category);

      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory,
      );

      setRelated(productsCopy.slice(0, 5));
    } else {
      setRelated([]);
    }
  }, [products, category, subCategory]);

  return (
    <section className="my-16 sm:my-20 lg:my-24">
      {/* Section Heading */}
      <div className="mb-8 text-center sm:mb-10">
        <div className="my-2 text-2xl sm:text-3xl">
          <Title text1="Related" text2=" Products" />
        </div>

        <p className="mx-auto mt-2 max-w-md px-4 text-xs leading-5 text-gray-500 sm:text-sm">
          You may also like these products from the same category.
        </p>
      </div>

      {/* Related Products */}
      {related.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 gap-y-5 sm:grid-cols-3 sm:gap-5 sm:gap-y-7 md:grid-cols-4 lg:grid-cols-5">
          {related.map((item) => (
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
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-10 text-center">
          <p className="text-sm text-gray-500">
            No related products available at the moment.
          </p>
        </div>
      )}
    </section>
  );
};

export default RelatedProduct;
