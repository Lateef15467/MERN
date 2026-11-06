import React, { useEffect } from "react";

export const TRACK_STEPS = [
  { label: "Order Placed", text: "We have received your order." },
  { label: "Packing", text: "Your items are being packed." },
  { label: "Shipped", text: "Your order has left our warehouse." },
  { label: "Out for delivery", text: "Our rider is on the way to you." },
  { label: "Delivered", text: "Your order has been delivered." },
];

// Turns any status text from the database into a step number.
// Returns -1 for cancelled orders.
export const getStepIndex = (status) => {
  const s = (status || "").toLowerCase().replace(/[^a-z]/g, "");
  if (s.includes("cancel")) return -1;
  if (s.includes("outfordelivery")) return 3;
  if (s.includes("delivered")) return 4;
  if (s.includes("shipped")) return 2;
  if (s.includes("packing") || s.includes("processing")) return 1;
  return 0;
};

export const getStatusDotColor = (status) => {
  const i = getStepIndex(status);
  if (i === -1) return "bg-red-500";
  if (i === 4) return "bg-green-500";
  if (i === 0) return "bg-gray-400";
  return "bg-orange-500";
};

const formatAddress = (address) => {
  if (!address) return "";
  if (typeof address === "string") return address;
  const name = [address.firstName, address.lastName].filter(Boolean).join(" ");
  const parts = [
    name,
    address.street,
    address.city,
    address.state,
    address.zipcode,
    address.country,
    address.phone,
  ].filter(Boolean);
  return parts.join(", ");
};

const TrackOrderModal = ({
  open,
  onClose,
  items,
  currency,
  onRefresh,
  refreshing,
  lastUpdated,
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

  if (!open || !items || items.length === 0) return null;

  const order = items[0];
  const current = getStepIndex(order.status);
  const cancelled = current === -1;
  const address = formatAddress(order.address);
  const orderNo = order.orderId
    ? `#${String(order.orderId).slice(-8).toUpperCase()}`
    : "";
  const isPaid = order.payment === true;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b px-6 py-4">
          <div>
            <p className="text-lg font-medium text-gray-800">Track Order</p>
            {orderNo && (
              <p className="text-sm text-gray-500">Order {orderNo}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Status */}
        <div className="px-6 py-5">
          {cancelled ? (
            <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              This order has been cancelled.
            </div>
          ) : (
            <ol>
              {TRACK_STEPS.map((step, i) => {
                const done = i < current || current === 4;
                const active = i === current && current !== 4;
                const last = i === TRACK_STEPS.length - 1;
                return (
                  <li key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                          done
                            ? "border-green-500 bg-green-500 text-white"
                            : active
                              ? "border-orange-500 bg-white text-orange-500"
                              : "border-gray-300 bg-white text-gray-300"
                        }`}
                      >
                        {done ? (
                          "✓"
                        ) : active ? (
                          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500" />
                        ) : (
                          ""
                        )}
                      </div>
                      {!last && (
                        <div
                          className={`w-0.5 flex-1 min-h-8 ${
                            done ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-6">
                      <p
                        className={`text-sm font-medium ${
                          done || active ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                        {active && (
                          <span className="ml-2 rounded bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {step.text}
                        {i === 0 && order.date
                          ? ` ${new Date(order.date).toLocaleString()}`
                          : ""}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>
              {lastUpdated
                ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                : ""}
            </span>
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "Refresh status"}
            </button>
          </div>
        </div>

        {/* Order details */}
        <div className="border-t bg-gray-50 px-6 py-4 text-sm text-gray-600">
          <div className="grid grid-cols-2 gap-y-2">
            <p className="text-gray-400">Payment method</p>
            <p>{order.paymentMethod}</p>
            <p className="text-gray-400">Payment status</p>
            <p className={isPaid ? "text-green-600" : "text-orange-600"}>
              {isPaid ? "Paid" : "Unpaid"}
            </p>
            {order.amount !== undefined && (
              <>
                <p className="text-gray-400">Order total</p>
                <p className="font-medium text-gray-800">
                  {currency}
                  {order.amount}
                </p>
              </>
            )}
          </div>
          {address && (
            <div className="mt-3">
              <p className="text-gray-400">Delivery address</p>
              <p>{address}</p>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="border-t px-6 py-4">
          <p className="mb-3 text-sm font-medium text-gray-800">
            Items in this order ({items.length})
          </p>
          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <img
                  src={item.image?.[0]}
                  alt=""
                  className="h-12 w-12 flex-shrink-0 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} · Size: {item.size}
                  </p>
                </div>
                <p className="text-gray-700">
                  {currency}
                  {item.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;
