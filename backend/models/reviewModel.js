import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, default: "User" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "", maxlength: 1000 },

    // Admin reply
    adminReply: {
      message: { type: String, default: "" },
      adminId: { type: String, default: "" },
      adminName: { type: String, default: "ShopNow Admin" },
      repliedAt: { type: Date, default: null },
    },
  },
  { timestamps: true },
);

// One review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const reviewModel =
  mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
