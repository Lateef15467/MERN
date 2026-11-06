import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

const buildSummary = async (productId) => {
  const rows = await reviewModel.aggregate([
    { $match: { productId: String(productId) } },
    { $group: { _id: "$rating", count: { $sum: 1 } } },
  ]);

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  let sum = 0;
  rows.forEach((r) => {
    distribution[r._id] = r.count;
    total += r.count;
    sum += r._id * r.count;
  });

  return {
    average: total ? Math.round((sum / total) * 10) / 10 : 0,
    count: total,
    distribution,
  };
};

// POST /api/review/add (logged in): creates or updates the user's review
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const numRating = Number(rating);

    if (!productId) {
      return res.json({ success: false, message: "Product is required" });
    }
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }
    const cleanComment = (comment || "").toString().trim();
    if (cleanComment.length > 1000) {
      return res.json({
        success: false,
        message: "Review must be under 1000 characters",
      });
    }

    const user = await userModel.findById(req.userId).select("name");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    await reviewModel.findOneAndUpdate(
      { productId: String(productId), userId: String(req.userId) },
      {
        $set: {
          userName: user.name || "User",
          rating: numRating,
          comment: cleanComment,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const summary = await buildSummary(productId);
    return res.json({ success: true, message: "Review saved", summary });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// GET /api/review/product/:productId (public, login optional)
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await reviewModel
      .find({ productId: String(productId) })
      .sort({ createdAt: -1 })
      .lean();

    const list = reviews.map((r) => ({
      _id: r._id,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      isMine: !!req.userId && r.userId === String(req.userId),
      canDelete: !!req.userId && r.userId === String(req.userId),
    }));

    const summary = await buildSummary(productId);
    return res.json({ success: true, reviews: list, summary });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// GET /api/review/summary/:productId (public), used by product cards
const getProductSummary = async (req, res) => {
  try {
    const summary = await buildSummary(req.params.productId);
    return res.json({ success: true, summary });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// DELETE /api/review/:id (owner or admin)
const deleteReview = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.id);
    if (!review) {
      return res.json({ success: false, message: "Review not found" });
    }

    if (review.userId !== String(req.userId)) {
      return res.json({
        success: false,
        message: "You can only delete your own review",
      });
    }

    await reviewModel.findByIdAndDelete(req.params.id);
    const summary = await buildSummary(review.productId);
    return res.json({ success: true, message: "Review deleted", summary });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { addReview, getProductReviews, getProductSummary, deleteReview };
