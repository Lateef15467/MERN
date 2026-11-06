import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import TrackOrderModal, {
  getStatusDotColor,
} from "../components/TrackOrderModal";

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
        // one entry per order, with its items inside
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

  // While the tracking popup is open, check for status updates every 30s
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
    orders.find((o) => o.orderId === trackedOrderId)?.items || [];

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="My" text2=" Orders" />
      </div>

      <div>
        {loaded && orders.length === 0 && (
          <p className="py-10 text-center text-gray-500">
            You have not placed any orders yet.
          </p>
        )}

        {orders.map((order) => (
          <div key={order.orderId} className="my-6 border text-gray-700">
            {/* Order header */}
            <div className="flex flex-col gap-3 border-b bg-gray-50 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">
                  Order #{String(order.orderId).slice(-8).toUpperCase()}
                </p>
                <p className="text-gray-400">
                  {new Date(order.date).toLocaleString()} ·{" "}
                  {order.paymentMethod}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <p
                    className={`h-2 w-2 rounded-full ${getStatusDotColor(order.status)}`}
                  ></p>
                  <p className="text-sm md:text-base">{order.status}</p>
                </div>
                <button
                  onClick={() => setTrackedOrderId(order.orderId)}
                  className="rounded-sm border px-4 py-2 text-sm font-medium hover:bg-gray-100"
                >
                  Track Order
                </button>
              </div>
            </div>

            {/* Items in this order */}
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-6 border-b px-4 py-4 text-sm last:border-b-0"
              >
                <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                <div>
                  <p className="font-medium sm:text-base">{item.name}</p>
                  <div className="mt-2 flex items-center gap-3 text-base">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Order total */}
            <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3 text-sm">
              <p className="text-gray-400">
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "items"}
              </p>
              <p className="font-medium text-gray-800">
                Total: {currency}
                {order.amount}
              </p>
            </div>
          </div>
        ))}
      </div>

      <TrackOrderModal
        open={!!trackedOrderId}
        onClose={() => setTrackedOrderId(null)}
        items={trackedItems}
        currency={currency}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        lastUpdated={lastUpdated}
      />
    </div>
  );
};

export default Order;
