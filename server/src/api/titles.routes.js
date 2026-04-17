import express from "express";
import {
  getTitles,
  getTitleById,
  getTrendingTitles,
  getRecentTitles,
  createTitle,
  updateTitle,
  deleteTitle,
} from "../controllers/titles.controller.js";
import { addEpisode, getEpisodes } from "../controllers/episodes.controller.js";
import { protect, moderatorOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getTitles);
router.get("/trending", getTrendingTitles);
router.get("/recent", getRecentTitles);
router.get("/:id", getTitleById);

// Episode routes for a title
router.get("/:titleId/episodes", getEpisodes);
router.post("/:titleId/episodes", protect, moderatorOnly, addEpisode);

// Protected routes (admin/moderator only)
router.post("/", protect, moderatorOnly, createTitle);
router.put("/:id", protect, moderatorOnly, updateTitle);
router.delete("/:id", protect, moderatorOnly, deleteTitle);

export default router;
