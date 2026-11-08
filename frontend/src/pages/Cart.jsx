import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } =
    useContext(ShopContext);

  const [cartData, setcartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }

      setcartData(tempData);
    } else {
      setcartData([]);
    }
  }, [cartItems, products]);

  const handleCheckout = () => {
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/place-order");
      navigate("/login");
    } else {
      navigate("/place-order");
    }
  };

  return (
    <section className="min-h-[60vh] border-t border-gray-100 px-3 pb-10 pt-8 sm:px-6 sm:pt-12 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-8 flex items-center justify-between sm:mb-10">
          <div>
            <div className="text-xl sm:text-2xl">
              <Title text1="Your " text2=" Cart" />
            </div>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Review your items before placing your order.
            </p>
          </div>

          {cartData.length > 0 && (
            <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 sm:text-sm">
              {cartData.length} {cartData.length === 1 ? "Item" : "Items"}
            </span>
          )}
        </div>

        {/* Empty Cart */}
        {cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 px-5 py-14 text-center sm:py-20">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
              <img
                src={assets.bin_icon}
                alt=""
                className="h-8 w-8 object-contain opacity-50"
              />
            </div>

            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-sm text-xs leading-6 text-gray-500 sm:text-sm">
              Looks like you haven't added anything to your cart yet. Explore
              our collection and find something you love.
            </p>

            <button
              type="button"
              onClick={() => navigate("/collection")}
              className="mt-6 rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Explore Products →
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
              {cartData.map((item, index) => {
                const productData = products.find(
                  (product) => product._id === item._id,
                );

                if (!productData) return null;

                return (
                  <div
                    key={`${item._id}-${item.size}`}
                    className={`grid grid-cols-[1fr_auto] items-center gap-3 px-3 py-4 sm:grid-cols-[1fr_110px_50px] sm:gap-5 sm:px-5 ${
                      index !== cartData.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    {/* Product Information */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 sm:h-24 sm:w-24">
                        <img
                          className="h-full w-full object-cover"
                          src={productData.image?.[0]}
                          alt={productData.name}
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-gray-800 sm:text-base">
                          {productData.name}
                        </p>

                        <p className="mt-2 text-sm font-bold text-gray-900">
                          {currency}
                          {productData.price}
                          <span className="ml-1 text-xs font-medium text-gray-500">
                            PKR
                          </span>
                        </p>

                        <span className="mt-2 inline-flex rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                          Size: {item.size}
                        </span>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col items-end gap-1 sm:items-center">
                      <label
                        htmlFor={`quantity-${item._id}-${item.size}`}
                        className="text-[10px] font-medium text-gray-400 sm:text-xs"
                      >
                        Quantity
                      </label>

                      <input
                        id={`quantity-${item._id}-${item.size}`}
                        onChange={(e) =>
                          e.target.value === "" || e.target.value === "0"
                            ? null
                            : updateQuantity(
                                item._id,
                                item.size,
                                Number(e.target.value),
                              )
                        }
                        className="w-14 rounded-lg border border-gray-200 bg-white px-2 py-2 text-center text-sm font-medium text-gray-800 outline-none transition-colors focus:border-orange-400 sm:w-16"
                        type="number"
                        min={1}
                        defaultValue={item.quantity}
                      />
                    </div>

                    {/* Remove Item */}
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id, item.size, 0)}
                      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-red-50"
                      aria-label={`Remove ${productData.name} from cart`}
                    >
                      <img
                        src={assets.bin_icon}
                        className="h-4 w-4 object-contain opacity-60 transition-opacity hover:opacity-100 sm:h-5 sm:w-5"
                        alt=""
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Cart Total and Checkout */}
            <div className="mt-10 flex justify-end sm:mt-14">
              <div className="w-full sm:max-w-[450px]">
                <CartTotal />

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-7 w-full rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-orange-600 hover:shadow-md"
                >
                  Proceed to Checkout →
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/collection")}
                  className="mt-3 w-full py-2 text-sm font-medium text-gray-500 transition-colors hover:text-orange-600"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;
