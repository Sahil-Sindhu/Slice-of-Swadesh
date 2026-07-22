import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Review } from "../models/Review";
import { sendSuccess } from "../utils/response";
import { handleError } from "../utils/errorHandler";
import { ValidationError } from "../errors/ValidationError";

// Hardcoded starter reviews in Hindi, Haryanvi, and English
const STARTER_REVIEWS = [
  {
    userName: "Jaipal Dahiya",
    rating: 5,
    comment: "घणा स्वाद पिज्जा था भाई! तंदूरी नान पिज्जा खाके मजा आ गया। कती जहर स्वाद था भाई, कसुता काम कर राखया सै!",
    language: "Haryanvi"
  },
  {
    userName: "Preeti Sharma",
    rating: 5,
    comment: "स्लाइस ऑफ स्वादिश का नान पिज़्ज़ा बेहद लाजवाब है! एकदम ताज़ा, कुरकुरा और स्वादिष्ट। मखमली मंगो शेक भी बेहतरीन था।",
    language: "Hindi"
  },
  {
    userName: "Vikram Hooda",
    rating: 5,
    comment: "The fusion cardamom burger was outstandingly juicy, and the saffron mango lassi is the best drink I have had in a long time. 10/10!",
    language: "English"
  }
];

export const getReviews = async (req: Request, res: Response) => {
  try {
    let reviews = await Review.find().sort({ createdAt: -1 }).limit(10).lean();
    
    // Seed starter reviews if the database is empty
    if (reviews.length === 0) {
      await Review.create(STARTER_REVIEWS);
      reviews = await Review.find().sort({ createdAt: -1 }).limit(10).lean();
    }
    
    return sendSuccess(res, "Reviews fetched successfully", { reviews });
  } catch (error) {
    return handleError(res, error);
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment, language } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      throw new ValidationError("Rating must be between 1 and 5 stars");
    }
    if (!comment || comment.trim().length < 5) {
      throw new ValidationError("Comment must be at least 5 characters long");
    }

    const userName = req.user ? req.user.name : "Anonymous Swadesh Guest";
    const avatar = req.user ? req.user.avatar : undefined;
    const userId = req.user ? req.user._id : undefined;

    const review = await Review.create({
      user: userId,
      userName,
      avatar,
      rating,
      comment,
      language: language || "English"
    });

    return sendSuccess(res, "Review submitted successfully", { review }, 201);
  } catch (error) {
    return handleError(res, error);
  }
};
