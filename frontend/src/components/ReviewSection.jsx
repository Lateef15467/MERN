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

  // Only loads reviews. It never touches the form fields.
  const fetchReviews = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/review/product/${productId}`,
        { headers: token ? { token } : {} },
      );
      if (data.success) {
        setReviews(data.reviews);
        setSummary(data.summary);
        // tell the product page so the top rating stays in sync
        if (onSummaryChange) onSummaryChange(data.summary);
      }
    } catch (error) {
      console.log(error);
    }
  }, [backendUrl, productId, token, onSummaryChange]);

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId, fetchReviews]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Please login to write a review");
    if (!rating) return toast.error("Please select a star rating");

    try {
      setSubmitting(true);
      const { data } = await axios.post(
        `${backendUrl}/api/review/add`,
        { productId, rating, comment },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        // clear the form after a successful submit
        setRating(0);
        setHover(0);
        setComment("");
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const removeReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const { data } = await axios.delete(`${backendUrl}/api/review/${id}`, {
        headers: { token },
      });
      if (data.success) {
        toast.success(data.message);
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const hasMine = reviews.some((r) => r.isMine);

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-xl font-medium mb-6">Ratings & Reviews</h2>

      {/* Summary */}
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

      {/* Form */}
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

      {/* List */}
      <div className="space-y-6 max-w-2xl">
        {reviews.length === 0 && (
          <p className="text-gray-500 text-sm">
            No reviews yet. Be the first to review this product.
          </p>
        )}

        {reviews.map((r) => (
          <div key={r._id} className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="font-medium text-sm">{r.userName}</p>
                <StarRating value={r.rating} size={14} />
              </div>
              <p className="text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
            {r.comment && (
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                {r.comment}
              </p>
            )}
            {r.canDelete && (
              <button
                onClick={() => removeReview(r._id)}
                className="text-xs text-red-600 mt-2"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
