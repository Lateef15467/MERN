import React, { useEffect } from "react";

const CartPopup = ({
  open,
  onClose,
  onView,
  product,
  size,
  cartCount,
  currency,
}) => {
  // close with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <p className="flex items-center gap-2 text-sm font-medium text-green-600">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
              ✓
            </span>
            Added to cart
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-gray-400 hover:text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Product */}
        <div className="flex gap-4 px-5 py-4">
          <img
            src={product.image[0]}
            alt={product.name}
            className="h-20 w-20 flex-shrink-0 object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-800">
              {product.name}
            </p>
            <p className="mt-1 text-sm text-gray-500">Size: {size}</p>
            <p className="mt-1 text-sm font-medium">
              {currency}
              {product.price}
              <span className="text-xs"> Pkr</span>
            </p>
          </div>
        </div>

        {/* Count */}
        <div className="border-t bg-gray-50 px-5 py-3 text-sm text-gray-600">
          Your cart now has{" "}
          <span className="font-semibold text-gray-900">{cartCount}</span>{" "}
          {cartCount === 1 ? "item" : "items"}
        </div>

        {/* Buttons at the bottom */}
        <div className="flex gap-3 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            Continue Shopping
          </button>
          <button
            type="button"
            onClick={onView}
            className="flex-1 bg-black py-2.5 text-sm text-white active:bg-gray-700"
          >
            View Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
