import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const ProductItem = ({ id, image, name, price, inStock }) => {
  const { currency, backendUrl } = useContext(ShopContext);
  const [rating, setRating] = useState({ average: 0, count: 0 });

  const isOutOfStock = !inStock;

  // Load average rating for this product
  useEffect(() => {
    let cancelled = false;

    const loadRating = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/review/summary/${id}`,
        );

        if (data.success && !cancelled) {
          setRating(data.summary);
        }
      } catch (error) {
        // Rating is optional; ignore errors
      }
    };

    if (backendUrl && id) loadRating();

    return () => {
      cancelled = true;
    };
  }, [backendUrl, id]);

  return (
    <div
      className={`group relative h-full overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg ${
        isOutOfStock ? "opacity-75" : ""
      }`}
    >
      <Link
        to={`/product/${id}`}
        className="absolute inset-0 z-10 rounded-xl"
        aria-label={`View ${name}`}
        onClick={() => window.scrollTo(0, 0)}
      />

      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={image?.[0]}
          alt={name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 ${
            isOutOfStock ? "grayscale-[25%]" : ""
          }`}
        />

        {/* Stock Badge */}
        <div className="absolute left-2 top-2">
          {isOutOfStock ? (
            <span className="rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Out of Stock
            </span>
          ) : (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-700 shadow-sm">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4">
        <p className="mb-2 line-clamp-2 min-h-[40px] text-sm font-medium leading-5 text-gray-800 transition-colors group-hover:text-orange-600 sm:text-base">
          {name}
        </p>

        {/* Rating */}
        <div className="mb-2 flex items-center gap-1.5">
          <StarRating value={rating.average} size={14} />
          <span className="text-xs text-gray-500">({rating.count})</span>
        </div>

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-1">
          <span className="text-base font-bold text-gray-900 sm:text-lg">
            {currency}
            {price}
          </span>
          <span className="text-xs font-medium text-gray-500">PKR</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
