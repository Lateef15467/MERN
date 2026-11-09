import React, { useContext, useEffect, useState, useCallback } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import StarRating from "./StarRating";

const ReviewSection = ({ productId, onSummaryChange }) => {
  const { backendUrl, token } = useContext(ShopContext);

  const [reviews, setReviews] = useState([]);

  const [summary, setSummary] = useState({
    average: 0,
    count: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Admin reply states
  const [replyInputs, setReplyInputs] = useState({});
  const [editingReply, setEditingReply] = useState({});
  const [replyLoading, setReplyLoading] = useState({});

  // Fetch reviews
  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/review/product/${productId}`,
        {
          headers: token ? { token } : {},
        },
      );

      if (data.success) {
        setReviews(data.reviews);
        setSummary(data.summary);

        if (onSummaryChange) {
          onSummaryChange(data.summary);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [backendUrl, productId, token, onSummaryChange]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, fetchReviews]);

  // Submit customer review
  const submitReview = async (e) => {
    e.preventDefault();

    if (!token) {
      return toast.error("Please login to write a review");
    }

    if (!rating) {
      return toast.error("Please select a star rating");
    }

    try {
      setSubmitting(true);

      const { data } = await axios.post(
        `${backendUrl}/api/review/add`,
        { productId, rating, comment },
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);

        setRating(0);
        setHover(0);
        setComment("");

        await fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete customer review
  const removeReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      const { data } = await axios.delete(`${backendUrl}/api/review/${id}`, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        await fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Submit or update admin reply
  const submitAdminReply = async (reviewId) => {
    const message = (replyInputs[reviewId] || "").trim();

    if (!message) {
      return toast.error("Please write a reply");
    }

    try {
      setReplyLoading((prev) => ({
        ...prev,
        [reviewId]: true,
      }));

      const { data } = await axios.post(
        `${backendUrl}/api/review/reply/${reviewId}`,
        { message },
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);

        setReplyInputs((prev) => ({
          ...prev,
          [reviewId]: "",
        }));

        setEditingReply((prev) => ({
          ...prev,
          [reviewId]: false,
        }));

        await fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setReplyLoading((prev) => ({
        ...prev,
        [reviewId]: false,
      }));
    }
  };

  // Delete admin reply
  const removeAdminReply = async (reviewId) => {
    if (!window.confirm("Delete your admin reply?")) return;

    try {
      setReplyLoading((prev) => ({
        ...prev,
        [reviewId]: true,
      }));

      const { data } = await axios.delete(
        `${backendUrl}/api/review/reply/${reviewId}`,
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);

        setReplyInputs((prev) => ({
          ...prev,
          [reviewId]: "",
        }));

        setEditingReply((prev) => ({
          ...prev,
          [reviewId]: false,
        }));

        await fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setReplyLoading((prev) => ({
        ...prev,
        [reviewId]: false,
      }));
    }
  };

  const hasMine = reviews.some((r) => r.isMine);

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-xl font-medium mb-6">Ratings & Reviews</h2>

      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-10">
        <div className="flex flex-col items-center justify-center sm:w-48">
          <p className="text-5xl font-semibold">{summary.average.toFixed(1)}</p>

          <StarRating value={summary.average} size={22} />

          <p className="text-sm text-gray-500 mt-1">
            {summary.count} {summary.count === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution[star] || 0;

            const pct = summary.count ? (count / summary.count) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-8">{star} ★</span>

                <div className="flex-1 h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-yellow-500 rounded"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className="w-8 text-right text-gray-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Review Form */}
      <form onSubmit={submitReview} className="border p-4 mb-10 max-w-2xl">
        <p className="font-medium mb-2">Write a review</p>

        {hasMine && (
          <p className="text-xs text-gray-500 mb-2">
            You already reviewed this product. Submitting again will replace
            your previous review.
          </p>
        )}

        <div className="flex gap-1 text-3xl mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setRating(s)}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              className={
                s <= (hover || rating) ? "text-yellow-500" : "text-gray-300"
              }
              aria-label={`${s} star`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Share your experience with this product (optional)"
          className="w-full border px-3 py-2 text-sm outline-none"
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-3 bg-black text-white px-6 py-2 text-sm disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Submit Review"}
        </button>

        {!token && (
          <p className="text-xs text-gray-500 mt-2">
            You need to be logged in to review.
          </p>
        )}
      </form>

      {/* Reviews List */}
      <div className="space-y-6 max-w-2xl">
        {reviews.length === 0 && (
          <p className="text-gray-500 text-sm">
            No reviews yet. Be the first to review this product.
          </p>
        )}

        {reviews.map((r) => (
          <div key={r._id} className="border-b pb-5">
            {/* Customer Information */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="font-medium text-sm">{r.userName}</p>

                <StarRating value={r.rating} size={14} />
              </div>

              <p className="text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Customer Comment */}
            {r.comment && (
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                {r.comment}
              </p>
            )}

            {/* Customer/Admin Delete Review */}
            {r.canDelete && (
              <button
                onClick={() => removeReview(r._id)}
                className="text-xs text-red-600 mt-2"
              >
                Delete Review
              </button>
            )}

            {/* Existing Admin Reply */}
            {r.adminReply?.message && (
              <div className="mt-4 ml-3 sm:ml-6 border-l-4 border-black bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">
                      {r.adminReply.adminName || "ShopNow Admin"}
                    </p>

                    <span className="text-[10px] bg-black text-white px-2 py-1 rounded">
                      ADMIN
                    </span>
                  </div>

                  {r.adminReply.repliedAt && (
                    <p className="text-xs text-gray-400">
                      {new Date(r.adminReply.repliedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                  {r.adminReply.message}
                </p>

                {/* Admin Edit/Delete Controls */}
                {r.canReply && (
                  <div className="flex gap-4 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyInputs((prev) => ({
                          ...prev,
                          [r._id]: r.adminReply.message,
                        }));

                        setEditingReply((prev) => ({
                          ...prev,
                          [r._id]: true,
                        }));
                      }}
                      className="text-xs text-blue-600"
                    >
                      Edit Reply
                    </button>

                    <button
                      type="button"
                      onClick={() => removeAdminReply(r._id)}
                      disabled={!!replyLoading[r._id]}
                      className="text-xs text-red-600 disabled:opacity-50"
                    >
                      Delete Reply
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Admin Reply Form */}
            {r.canReply && (
              <div className="mt-4 ml-3 sm:ml-6">
                {(!r.adminReply?.message || editingReply[r._id]) && (
                  <div className="border rounded p-3">
                    <p className="font-medium text-sm mb-2">
                      {r.adminReply?.message
                        ? "Edit Admin Reply"
                        : "Reply as Admin"}
                    </p>

                    <textarea
                      value={replyInputs[r._id] || ""}
                      onChange={(e) =>
                        setReplyInputs((prev) => ({
                          ...prev,
                          [r._id]: e.target.value,
                        }))
                      }
                      maxLength={1000}
                      rows={3}
                      placeholder="Write a reply to this review..."
                      className="w-full border px-3 py-2 text-sm outline-none resize-y"
                    />

                    <div className="flex justify-end gap-2 mt-3">
                      {editingReply[r._id] && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReply((prev) => ({
                              ...prev,
                              [r._id]: false,
                            }));

                            setReplyInputs((prev) => ({
                              ...prev,
                              [r._id]: "",
                            }));
                          }}
                          className="border px-4 py-2 text-xs"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => submitAdminReply(r._id)}
                        disabled={!!replyLoading[r._id]}
                        className="bg-black text-white px-5 py-2 text-xs disabled:opacity-50"
                      >
                        {replyLoading[r._id]
                          ? "Saving..."
                          : r.adminReply?.message
                            ? "Update Reply"
                            : "Submit Reply"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
