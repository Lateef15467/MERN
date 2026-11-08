import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className="w-full rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
      {/* Heading */}
      <div className="mb-5">
        <Title text1={"CART"} text2={" TOTAL"} />
        <p className="mt-1 text-xs text-gray-500">A summary of your order</p>
      </div>

      {/* Price Details */}
      <div className="flex flex-col gap-4 text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-gray-500">Subtotal</p>
          <p className="font-medium text-gray-900">
            {currency}
            {subtotal}.00
          </p>
        </div>

        <div className="border-t border-gray-100" />

        {/* Delivery Fee */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-gray-500">Delivery Fee</p>
          <p className="font-medium text-gray-900">
            {currency}
            {delivery_fee}.00
          </p>
        </div>

        <div className="border-t border-gray-100" />

        {/* Total */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="font-semibold text-gray-900">Total Amount</p>
          <p className="text-lg font-bold text-gray-900">
            {currency}
            {total}.00
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-5 rounded-lg bg-gray-50 px-3 py-3">
        <p className="text-xs leading-relaxed text-gray-500">
          Delivery charges are included in your total order amount.
        </p>
      </div>
    </div>
  );
};

export default CartTotal;
