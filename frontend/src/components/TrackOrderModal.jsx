import React, { useEffect } from "react";

export const TRACK_STEPS = [
  { label: "Order Placed", text: "We have received your order." },
  { label: "Packing", text: "Your items are being packed." },
  { label: "Shipped", text: "Your order has left our warehouse." },
  { label: "Out for delivery", text: "Our rider is on the way to you." },
  { label: "Delivered", text: "Your order has been delivered." },
];

// Turns any status text from the database into a step number.
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
  // Close with Escape key
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 py-4 backdrop-blur-sm sm:px-5"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="track-order-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
          <div>
            <h2
              id="track-order-title"
              className="text-lg font-bold text-gray-900 sm:text-xl"
            >
              Track Your Order
            </h2>

            {orderNo && (
              <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
                Order {orderNo}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto">
          {/* Tracking Status */}
          <div className="px-4 py-5 sm:px-6 sm:py-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800 sm:text-base">
                Order Progress
              </h3>

              {!cancelled && current === 4 && (
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Delivered
                </span>
              )}
            </div>

            {cancelled ? (
              <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  !
                </span>
                <div>
                  <p className="text-sm font-semibold text-red-700">
                    Order Cancelled
                  </p>
                  <p className="mt-1 text-xs leading-5 text-red-600">
                    This order has been cancelled.
                  </p>
                </div>
              </div>
            ) : (
              <ol>
                {TRACK_STEPS.map((step, i) => {
                  const done = i < current || current === 4;
                  const active = i === current && current !== 4;
                  const last = i === TRACK_STEPS.length - 1;

                  return (
                    <li key={step.label} className="flex gap-3 sm:gap-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                            done
                              ? "border-green-500 bg-green-500 text-white"
                              : active
                                ? "border-orange-500 bg-orange-50 text-orange-600"
                                : "border-gray-200 bg-white text-gray-300"
                          }`}
                        >
                          {done ? (
                            "✓"
                          ) : active ? (
                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500" />
                          ) : (
                            i + 1
                          )}
                        </div>

                        {!last && (
                          <div
                            className={`min-h-9 w-0.5 flex-1 ${
                              done ? "bg-green-400" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>

                      {/* Step Details */}
                      <div className="min-w-0 flex-1 pb-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={`text-sm font-semibold ${
                              done || active ? "text-gray-800" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>

                          {active && (
                            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-semibold text-orange-600">
                              CURRENT
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
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

            {/* Refresh */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <span className="text-[11px] text-gray-400">
                {lastUpdated
                  ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                  : "Status information"}
              </span>

              <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                className="rounded-lg border border-orange-200 px-4 py-2 text-xs font-semibold text-orange-600 transition-all hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {refreshing ? "Refreshing..." : "↻ Refresh Status"}
              </button>
            </div>
          </div>

          {/* Order Details */}
          <div className="border-y border-gray-100 bg-gray-50/80 px-4 py-5 sm:px-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-800">
              Order Information
            </h3>

            <div className="grid grid-cols-2 gap-x-3 gap-y-4 text-xs sm:text-sm">
              <p className="text-gray-500">Payment Method</p>
              <p className="break-words font-medium text-gray-800">
                {order.paymentMethod}
              </p>

              <p className="text-gray-500">Payment Status</p>
              <p
                className={`font-semibold ${
                  isPaid ? "text-green-600" : "text-orange-600"
                }`}
              >
                {isPaid ? "Paid" : "Unpaid"}
              </p>

              {order.amount !== undefined && (
                <>
                  <p className="text-gray-500">Order Total</p>
                  <p className="font-bold text-gray-900">
                    {currency}
                    {order.amount}
                  </p>
                </>
              )}
            </div>

            {address && (
              <div className="mt-5 border-t border-gray-200 pt-4">
                <p className="mb-1 text-xs font-medium text-gray-500">
                  Delivery Address
                </p>
                <p className="text-sm leading-6 text-gray-800">{address}</p>
              </div>
            )}
          </div>

          {/* Ordered Items */}
          <div className="px-4 py-5 sm:px-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-800">
              Items in This Order
              <span className="ml-2 rounded-full bg-orange-50 px-2.5 py-1 text-xs text-orange-600">
                {items.length}
              </span>
            </h3>

            <div className="flex flex-col gap-4">
              {items.map((item, i) => (
                <div
                  key={item._id || `${item.name}-${i}`}
                  className="flex min-w-0 items-center gap-3"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 sm:h-16 sm:w-16">
                    <img
                      src={item.image?.[0]}
                      alt={item.name || "Product"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.quantity} <span className="mx-1">·</span>
                      Size: {item.size}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-gray-800">
                    {currency}
                    {item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-white px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;
