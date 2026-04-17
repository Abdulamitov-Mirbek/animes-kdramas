import express from "express";
import { protect, moderatorOnly } from "../middleware/auth.middleware.js";
import {
  uploadVideo,
  uploadSubtitle,
} from "../middleware/upload.middleware.js";
import {
  getEpisodes,
  getEpisodeById,
  addEpisode,
  updateEpisode,
  deleteEpisode,
  addSubtitles,
} from "../controllers/episodes.controller.js";

const router = express.Router();

// Public routes
router.get("/title/:titleId", getEpisodes);
router.get("/:id", getEpisodeById);

// Protected routes
router.post(
  "/title/:titleId",
  protect,
  moderatorOnly,
  uploadVideo.single("video"),
  addEpisode,
);
router.put("/:id", protect, moderatorOnly, updateEpisode);
router.delete("/:id", protect, moderatorOnly, deleteEpisode);
router.post(
  "/:id/subtitles",
  protect,
  moderatorOnly,
  uploadSubtitle.single("subtitle"),
  addSubtitles,
);

export default router;
