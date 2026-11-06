import express from "express";
import {
  addReview,
  getProductReviews,
  getProductSummary,
  deleteReview,
} from "../controller/reviewController.js";
import { requireAuth, optionalAuth } from "../middleware/reviewAuth.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", requireAuth, addReview);
reviewRouter.get("/product/:productId", optionalAuth, getProductReviews);
reviewRouter.get("/summary/:productId", getProductSummary);
reviewRouter.delete("/:id", requireAuth, deleteReview);

export default reviewRouter;
