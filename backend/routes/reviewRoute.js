import express from "express";

import {
  addReview,
  getProductReviews,
  getProductSummary,
  deleteReview,
  addAdminReply,
  deleteAdminReply,
} from "../controller/reviewController.js";

import { requireAuth, optionalAuth } from "../middleware/reviewAuth.js";

const reviewRouter = express.Router();

// Customer reviews
reviewRouter.post("/add", requireAuth, addReview);
reviewRouter.get("/product/:productId", optionalAuth, getProductReviews);
reviewRouter.get("/summary/:productId", getProductSummary);
reviewRouter.delete("/:id", requireAuth, deleteReview);

// Admin replies
reviewRouter.post("/reply/:id", requireAuth, addAdminReply);
reviewRouter.delete("/reply/:id", requireAuth, deleteAdminReply);

export default reviewRouter;
