import Episode from "../models/Episode.model.js";
import Title from "../models/Title.model.js";
import logger from "../utils/logger.js";

// Get all episodes for a title
export const getEpisodes = async (req, res, next) => {
  try {
    const { titleId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const episodes = await Episode.find({ titleId, isActive: true })
      .sort({ number: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Episode.countDocuments({ titleId, isActive: true });

    res.json({
      success: true,
      episodes,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    logger.error("Get episodes error:", error);
    next(error);
  }
};

// Get single episode by ID
export const getEpisodeById = async (req, res, next) => {
  try {
    const episode = await Episode.findById(req.params.id).populate(
      "titleId",
      "title type poster",
    );

    if (!episode) {
      return res.status(404).json({
        success: false,
        message: "Episode not found",
      });
    }

    // Increment views
    episode.views += 1;
    await episode.save();

    res.json({
      success: true,
      episode,
    });
  } catch (error) {
    logger.error("Get episode by ID error:", error);
    next(error);
  }
};

// Add new episode
export const addEpisode = async (req, res, next) => {
  try {
    const { titleId } = req.params;
    const episodeData = req.body;

    // Check if title exists
    const title = await Title.findById(titleId);
    if (!title) {
      return res.status(404).json({
        success: false,
        message: "Title not found",
      });
    }

    // Check if episode number already exists
    const existingEpisode = await Episode.findOne({
      titleId,
      number: episodeData.number,
    });

    if (existingEpisode) {
      return res.status(400).json({
        success: false,
        message: `Episode ${episodeData.number} already exists for this title`,
      });
    }

    // Handle video upload if file exists
    if (req.file) {
      episodeData.videoUrl = `/uploads/videos/${req.file.filename}`;
    }

    const episode = new Episode({
      ...episodeData,
      titleId,
    });

    await episode.save();

    // Update title's episodes array and total count
    title.episodes.push(episode._id);
    title.totalEpisodes = title.episodes.length;
    await title.save();

    res.status(201).json({
      success: true,
      message: "Episode added successfully",
      episode,
    });
  } catch (error) {
    logger.error("Add episode error:", error);
    next(error);
  }
};

// Update episode
export const updateEpisode = async (req, res, next) => {
  try {
    const episode = await Episode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!episode) {
      return res.status(404).json({
        success: false,
        message: "Episode not found",
      });
    }

    res.json({
      success: true,
      message: "Episode updated successfully",
      episode,
    });
  } catch (error) {
    logger.error("Update episode error:", error);
    next(error);
  }
};

// Delete episode (soft delete)
export const deleteEpisode = async (req, res, next) => {
  try {
    const episode = await Episode.findById(req.params.id);

    if (!episode) {
      return res.status(404).json({
        success: false,
        message: "Episode not found",
      });
    }

    // Soft delete
    episode.isActive = false;
    await episode.save();

    // Update title's total episodes count
    const title = await Title.findById(episode.titleId);
    if (title) {
      title.totalEpisodes = await Episode.countDocuments({
        titleId: episode.titleId,
        isActive: true,
      });
      await title.save();
    }

    res.json({
      success: true,
      message: "Episode deleted successfully",
    });
  } catch (error) {
    logger.error("Delete episode error:", error);
    next(error);
  }
};

// Track watching progress
export const trackWatching = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { progress, completed } = req.body;

    const episode = await Episode.findById(id);
    if (!episode) {
      return res.status(404).json({
        success: false,
        message: "Episode not found",
      });
    }

    // Here you can add logic to track user's watching progress
    // For now, just increment views if completed
    if (completed) {
      episode.views += 1;
      await episode.save();
    }

    res.json({
      success: true,
      message: "Progress tracked",
      episode,
    });
  } catch (error) {
    logger.error("Track watching error:", error);
    next(error);
  }
};

// Add subtitles to episode
export const addSubtitles = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { language } = req.body;
    
    const episode = await Episode.findById(id);
    if (!episode) {
      return res.status(404).json({
        success: false,
        message: 'Episode not found',
      });
    }
    
    if (req.file) {
      episode.subtitles.push({
        language: language || 'ru',
        url: `/uploads/subtitles/${req.file.filename}`,
      });
      await episode.save();
    }
    
    res.json({
      success: true,
      message: 'Subtitles added successfully',
      subtitles: episode.subtitles,
    });
  } catch (error) {
    logger.error('Add subtitles error:', error);
    next(error);
  }
};
