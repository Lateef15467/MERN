import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

// Calculate product rating summary
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

// Verify that the authenticated user is an admin
const getAdmin = async (userId) => {
  if (!userId) return null;

  return await userModel.findById(userId).select("name role");
};

// POST /api/review/add
// Logged-in users can create or update their reviews
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const numRating = Number(rating);

    if (!productId) {
      return res.json({
        success: false,
        message: "Product is required",
      });
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
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    await reviewModel.findOneAndUpdate(
      {
        productId: String(productId),
        userId: String(req.userId),
      },
      {
        $set: {
          userName: user.name || "User",
          rating: numRating,
          comment: cleanComment,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    const summary = await buildSummary(productId);

    return res.json({
      success: true,
      message: "Thank you for your review!",
      summary,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/review/product/:productId
// Public reviews, login optional
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await reviewModel
      .find({ productId: String(productId) })
      .sort({ createdAt: -1 })
      .lean();

    // Check whether current user is admin
    let isAdmin = false;

    if (req.userId) {
      const user = await getAdmin(req.userId);
      isAdmin = user?.role === "admin";
    }

    const list = reviews.map((r) => ({
      _id: r._id,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,

      isMine: !!req.userId && r.userId === String(req.userId),

      canDelete: !!req.userId && (r.userId === String(req.userId) || isAdmin),

      canReply: isAdmin,

      adminReply: {
        message: r.adminReply?.message || "",
        adminName: r.adminReply?.adminName || "ShopNow Admin",
        repliedAt: r.adminReply?.repliedAt || null,
      },
    }));

    const summary = await buildSummary(productId);

    return res.json({
      success: true,
      reviews: list,
      summary,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/review/summary/:productId
// Public product rating summary
const getProductSummary = async (req, res) => {
  try {
    const summary = await buildSummary(req.params.productId);

    return res.json({
      success: true,
      summary,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/review/reply/:id
// Admin can add or update a reply
const addAdminReply = async (req, res) => {
  try {
    const { message } = req.body;

    const cleanMessage = (message || "").toString().trim();

    if (!cleanMessage) {
      return res.json({
        success: false,
        message: "Reply cannot be empty",
      });
    }

    if (cleanMessage.length > 1000) {
      return res.json({
        success: false,
        message: "Reply must be under 1000 characters",
      });
    }

    // Verify admin from database
    const admin = await getAdmin(req.userId);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can reply to reviews",
      });
    }

    const review = await reviewModel.findById(req.params.id);

    if (!review) {
      return res.json({
        success: false,
        message: "Review not found",
      });
    }

    review.adminReply = {
      message: cleanMessage,
      adminId: String(req.userId),
      adminName: admin.name || "ShopNow Admin",
      repliedAt: new Date(),
    };

    await review.save();

    return res.json({
      success: true,
      message: "Admin reply saved successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/review/reply/:id
// Only admin can delete their reply
const deleteAdminReply = async (req, res) => {
  try {
    const admin = await getAdmin(req.userId);

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete replies",
      });
    }

    const review = await reviewModel.findById(req.params.id);

    if (!review) {
      return res.json({
        success: false,
        message: "Review not found",
      });
    }

    if (!review.adminReply?.message) {
      return res.json({
        success: false,
        message: "No admin reply found",
      });
    }

    review.adminReply = {
      message: "",
      adminId: "",
      adminName: "ShopNow Admin",
      repliedAt: null,
    };

    await review.save();

    return res.json({
      success: true,
      message: "Admin reply deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/review/:id
// Review owner or admin can delete a review
const deleteReview = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.id);

    if (!review) {
      return res.json({
        success: false,
        message: "Review not found",
      });
    }

    const isOwner = review.userId === String(req.userId);

    let isAdmin = false;

    if (!isOwner) {
      const user = await getAdmin(req.userId);
      isAdmin = user?.role === "admin";
    }

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this review",
      });
    }

    await reviewModel.findByIdAndDelete(req.params.id);

    const summary = await buildSummary(review.productId);

    return res.json({
      success: true,
      message: "Review deleted successfully",
      summary,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addReview,
  getProductReviews,
  getProductSummary,
  deleteReview,
  addAdminReply,
  deleteAdminReply,
};
