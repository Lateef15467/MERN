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
        if (data.success && !cancelled) setRating(data.summary);
      } catch (error) {
        // rating is optional; ignore errors
      }
    };
    if (backendUrl && id) loadRating();
    return () => {
      cancelled = true;
    };
  }, [backendUrl, id]);

  return (
    <div
      className={`text-gray-700 relative ${isOutOfStock ? "opacity-50" : ""}`}
    >
      {/* CLICKABLE LINK — ALWAYS WORKS */}
      <Link
        to={`/product/${id}`}
        className="absolute inset-0 z-10"
        onClick={() => window.scrollTo(0, 0)}
      />

      {/* Product Image */}
      <div className="overflow-hidden">
        <img
          src={image[0]}
          className="hover:scale-110 transition ease-in-out"
          alt={name}
        />
      </div>

      {/* Product Name */}
      <p className="pt-3 pb-1 text-sm">{name}</p>

      {/* Rating */}
      <div className="flex items-center gap-1 pb-1">
        <StarRating value={rating.average} size={14} />
        <span className="text-xs text-gray-500">({rating.count})</span>
      </div>

      {/* Product Price */}
      <p className="text-sm font-medium">
        {currency}
        {price}
        <span className="text-sm"> Pkr</span>
      </p>

      {/* Stock Status */}
      {isOutOfStock ? (
        <p className="text-red-600 text-sm font-semibold mt-1">Out of Stock</p>
      ) : (
        <p className="text-green-600 text-sm mt-1">In Stock</p>
      )}
    </div>
  );
};

export default ProductItem;
