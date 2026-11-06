import React from "react";

// Read-only star display. Supports decimals (e.g. 4.3)
const StarRating = ({ value = 0, size = 16 }) => {
  const percent = Math.max(0, Math.min(5, value)) * 20;
  return (
    <div
      className="relative inline-block leading-none"
      style={{ fontSize: size }}
      aria-label={`${value} out of 5`}
    >
      <div className="text-gray-300">★★★★★</div>
      <div
        className="absolute top-0 left-0 overflow-hidden whitespace-nowrap text-yellow-500"
        style={{ width: `${percent}%` }}
      >
        ★★★★★
      </div>
    </div>
  );
};

export default StarRating;
