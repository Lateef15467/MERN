import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, default: "User" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "", maxlength: 1000 },
  },
  { timestamps: true },
);

// one review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const reviewModel =
  mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
