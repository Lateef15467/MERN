import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import TrackOrderModal, {
  getStatusDotColor,
} from "../components/TrackOrderModal";
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaCreditCard,
  FaTruck,
} from "react-icons/fa";

const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [trackedOrderId, setTrackedOrderId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + "/api/orders/userorders",
        {},
        { headers: { token } },
      );

      if (response.data.success) {
        // One entry per order, with its items inside
        const list = response.data.orders.map((order) => ({
          orderId: order._id,
          status: order.status,
          payment: order.payment,
          paymentMethod: order.paymentMethod,
          date: order.date,
          amount: order.amount,
          address: order.address,
          items: order.items.map((item) => ({
            ...item,
            orderId: order._id,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
            amount: order.amount,
            address: order.address,
          })),
        }));

        setOrders(list.reverse());
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  // Automatically refresh order status while tracking is open
  useEffect(() => {
    if (!trackedOrderId) return;

    const timer = setInterval(loadOrderData, 30000);

    return () => clearInterval(timer);
  }, [trackedOrderId, token]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrderData();
    setRefreshing(false);
  };

  const trackedItems =
    orders.find((order) => order.orderId === trackedOrderId)?.items || [];

  return (
    <main className="min-h-[60vh] border-t border-gray-100 bg-white px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Page Heading */}
        <div className="mb-8 sm:mb-10">
          <Title text1="My" text2=" Orders" />

          <p className="mt-3 text-sm text-gray-500">
            View your purchases and keep track of your orders.
          </p>
        </div>

        {/* Loading State */}
        {!loaded && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-orange-100 border-t-[#FCA311]" />
            <p className="mt-4 text-sm text-gray-500">Loading your orders...</p>
          </div>
        )}

        {/* Empty State */}
        {loaded && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#FCA311]">
              <FaBoxOpen size={28} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-800">
              No Orders Yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
              You haven't placed any orders yet. Explore our collection and find
              something you love.
            </p>

            <button
              onClick={() => navigate("/collection")}
              className="mt-6 rounded-full bg-[#0B132B] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[#FCA311] hover:text-[#0B132B]"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders List */}
        {loaded && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <article
                key={order.orderId}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/80 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Order Number
                    </p>

                    <h3 className="mt-1 text-base font-bold text-[#0B132B] sm:text-lg">
                      #{String(order.orderId).slice(-8).toUpperCase()}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 sm:text-sm">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#FCA311]" />
                        {new Date(order.date).toLocaleString()}
                      </span>

                      <span className="flex items-center gap-2">
                        <FaCreditCard className="text-[#FCA311]" />
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-start">
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${getStatusDotColor(
                          order.status,
                        )}`}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {order.status}
                      </span>
                    </div>

                    <button
                      onClick={() => setTrackedOrderId(order.orderId)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B132B] px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#FCA311] hover:text-[#0B132B]"
                    >
                      <FaTruck />
                      Track Order
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-gray-100 px-4 sm:px-6">
                  {order.items.map((item, index) => (
                    <div
                      key={item._id || `${item.name}-${index}`}
                      className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center"
                    >
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                        <img
                          className="h-full w-full object-cover"
                          src={item.image?.[0]}
                          alt={item.name || "Ordered product"}
                          loading="lazy"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-800 sm:text-base">
                          {item.name}
                        </h4>

                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                          <p>
                            Price:{" "}
                            <span className="font-medium text-gray-800">
                              {currency}
                              {item.price}
                            </span>
                          </p>

                          <p>
                            Quantity:{" "}
                            <span className="font-medium text-gray-800">
                              {item.quantity}
                            </span>
                          </p>

                          <p>
                            Size:{" "}
                            <span className="font-medium text-gray-800">
                              {item.size}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p className="text-xs text-gray-400">Item Total</p>
                        <p className="mt-1 font-semibold text-[#0B132B]">
                          {currency}
                          {Number(item.price) * Number(item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="text-sm text-gray-500">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "product" : "products"} in this
                    order
                  </p>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-sm font-medium text-gray-500">
                      Order Total
                    </span>

                    <span className="text-lg font-bold text-[#0B132B]">
                      {currency}
                      {order.amount}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Track Order Modal */}
      <TrackOrderModal
        open={!!trackedOrderId}
        onClose={() => setTrackedOrderId(null)}
        items={trackedItems}
        currency={currency}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        lastUpdated={lastUpdated}
      />
    </main>
  );
};

export default Order;
