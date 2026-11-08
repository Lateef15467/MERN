import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";

const PlaceOrder = () => {
  const [method, setmethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setformData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setformData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    const allFilled = Object.values(formData).every((val) => val.trim() !== "");

    if (!allFilled) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items),
            );

            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod": {
          try {
            const response = await axios.post(
              backendUrl + "/api/orders/place",
              orderData,
              { headers: { token } },
            );

            if (response.data.success) {
              toast.success("Order Confirmed Successfully! 🎉");
              setCartItems({});
              navigate("/orders");
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            console.log("COD Error:", error.message);
            toast.error("Failed to place COD order");
          }

          break;
        }

        case "easypaise":
          toast.error("EasyPaisa not available yet");
          break;

        case "jazzcash":
          toast.error("jazzcash not available yet");
          break;

        default:
          toast.error("Please select a valid payment method");
          break;
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong while placing your order");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: "easypaise",
      name: "EasyPaisa",
      image: assets.easypaise_logo,
      available: false,
    },
    {
      id: "jazzcash",
      name: "JazzCash",
      image: assets.jazzcash_logo,
      available: false,
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      image: null,
      available: true,
    },
  ];

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-[#FCA311] focus:bg-white focus:ring-4 focus:ring-orange-100";

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] border-t border-gray-100 bg-white px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FCA311]">
            Almost There
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[#0B132B] sm:text-3xl">
            Complete Your Order
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your delivery details and choose your preferred payment
            method.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.3fr_0.8fr] lg:gap-12">
          {/* Left Side - Delivery Information */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#FCA311]">
                <FaMapMarkerAlt size={19} />
              </div>

              <div>
                <Title text1="Delivery" text2=" Information" />
                <p className="mt-1 text-xs text-gray-400">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  required
                  onChange={onChangeHandler}
                  name="firstName"
                  value={formData.firstName}
                  className={inputClass}
                  type="text"
                  placeholder="Enter first name"
                  autoComplete="given-name"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Last Name *
                </label>
                <input
                  id="lastName"
                  required
                  onChange={onChangeHandler}
                  name="lastName"
                  value={formData.lastName}
                  className={inputClass}
                  type="text"
                  placeholder="Enter last name"
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Street */}
            <div className="mt-5">
              <label
                htmlFor="street"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Street Address *
              </label>
              <input
                id="street"
                required
                onChange={onChangeHandler}
                name="street"
                value={formData.street}
                className={inputClass}
                type="text"
                placeholder="House number, street or area"
                autoComplete="street-address"
              />
            </div>

            {/* City */}
            <div className="mt-5">
              <label
                htmlFor="city"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                City *
              </label>
              <input
                id="city"
                required
                onChange={onChangeHandler}
                name="city"
                value={formData.city}
                className={inputClass}
                type="text"
                placeholder="Enter your city"
                autoComplete="address-level2"
              />
            </div>

            {/* Phone */}
            <div className="mt-5">
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Phone Number *
              </label>
              <input
                id="phone"
                required
                onChange={onChangeHandler}
                name="phone"
                value={formData.phone}
                className={inputClass}
                type="tel"
                placeholder="+92 3XX XXXXXXX"
                autoComplete="tel"
              />
              <p className="mt-2 text-xs text-gray-400">
                Please provide a reachable number for delivery updates.
              </p>
            </div>

            {/* Delivery Note */}
            <div className="mt-7 flex items-start gap-3 rounded-xl bg-orange-50/70 p-4">
              <FaCheckCircle className="mt-0.5 shrink-0 text-[#FCA311]" />
              <p className="text-xs leading-6 text-gray-600">
                Please make sure your delivery details are correct to help us
                deliver your order smoothly.
              </p>
            </div>
          </div>

          {/* Right Side - Summary and Payment */}
          <div className="flex flex-col gap-6">
            {/* Order Summary */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FCA311]">
                  <FaCreditCard size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#0B132B]">
                    Order Summary
                  </h2>
                  <p className="text-xs text-gray-400">
                    Review your order total
                  </p>
                </div>
              </div>

              <CartTotal />
            </div>

            {/* Payment Methods */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <Title text1="Payment" text2=" Method" />
                <p className="mt-2 text-xs text-gray-400">
                  Select how you want to pay.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {paymentMethods.map((payment) => {
                  const selected = method === payment.id;

                  return (
                    <button
                      key={payment.id}
                      type="button"
                      onClick={() => setmethod(payment.id)}
                      aria-pressed={selected}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                        selected
                          ? "border-[#FCA311] bg-orange-50/60 shadow-sm"
                          : "border-gray-200 bg-white hover:border-orange-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected
                              ? "border-[#FCA311] bg-[#FCA311]"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {selected && (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </span>

                        {payment.image ? (
                          <img
                            src={payment.image}
                            className="h-7 max-w-[105px] object-contain"
                            alt={payment.name}
                          />
                        ) : (
                          <FaMoneyBillWave
                            className="shrink-0 text-[#FCA311]"
                            size={23}
                          />
                        )}

                        <span className="text-sm font-medium text-gray-700">
                          {payment.name}
                        </span>
                      </div>

                      {selected && (
                        <FaCheckCircle
                          className="shrink-0 text-[#FCA311]"
                          size={17}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-xs leading-6 text-gray-500">
                  {method === "cod"
                    ? "Pay in cash when your order is delivered."
                    : method === "easypaise"
                      ? "EasyPaisa is not available yet."
                      : "JazzCash is not available yet."}
                </p>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-6 flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-sm font-semibold transition-all duration-300 ${
                  loading
                    ? "cursor-not-allowed bg-gray-400 text-white"
                    : "bg-[#0B132B] text-white shadow-md hover:bg-[#FCA311] hover:text-[#0B132B] hover:shadow-lg"
                }`}
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Processing Order...
                  </>
                ) : (
                  "Place Order"
                )}
                {!loading && <span>→</span>}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-gray-400">
                Your order details will be submitted securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
