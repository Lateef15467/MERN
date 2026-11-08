import React, { useEffect } from "react";
import { FiCheck, FiX, FiShoppingBag, FiArrowRight } from "react-icons/fi";

const CartPopup = ({
  open,
  onClose,
  onView,
  product,
  size,
  cartCount,
  currency,
}) => {
  // Close popup with Escape key
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-[3px] animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-popup-title"
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Header */}
        <div className="relative border-b border-gray-100 px-5 py-5 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close popup"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <FiX size={19} />
          </button>

          <div className="flex items-center gap-3 pr-8">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
              <FiCheck size={23} strokeWidth={2.5} />
            </div>

            <div>
              <h2
                id="cart-popup-title"
                className="text-base font-semibold text-gray-900 sm:text-lg"
              >
                Added to your cart!
              </h2>
              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                Your product has been added successfully.
              </p>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-5 sm:p-6">
          <div className="flex gap-4">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-28">
              <img
                src={product.image?.[0]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <p className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 sm:text-base">
                {product.name}
              </p>

              <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                Selected Size:{" "}
                <span className="font-medium text-gray-800">
                  {size || "N/A"}
                </span>
              </p>

              <p className="mt-2 text-base font-bold text-gray-900 sm:text-lg">
                {currency}
                {product.price}
                <span className="ml-1 text-xs font-normal text-gray-500">
                  PKR
                </span>
              </p>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="mt-6 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm">
                <FiShoppingBag size={17} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Your shopping cart</p>
                <p className="text-sm font-semibold text-gray-900">
                  {cartCount} {cartCount === 1 ? "Item" : "Items"}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Updated
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition duration-200 hover:border-gray-900 hover:bg-gray-50 active:scale-[0.98]"
            >
              Continue Shopping
            </button>

            <button
              type="button"
              onClick={onView}
              className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-gray-700 active:scale-[0.98]"
            >
              View Cart
              <FiArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
