import User from "../models/User.model.js";
import History from "../models/History.model.js";
import Favorite from "../models/Favorite.model.js";
import Title from "../models/Title.model.js";
import logger from "../utils/logger.js";

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    logger.error("Get current user error:", error);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    logger.error("Update profile error:", error);
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const { language, quality, notifications, autoplay, subtitles } = req.body;

    const user = await User.findById(req.user._id);

    if (language) user.preferences.language = language;
    if (quality) user.preferences.quality = quality;
    if (notifications !== undefined)
      user.preferences.notifications = notifications;
    if (autoplay !== undefined) user.preferences.autoplay = autoplay;
    if (subtitles) user.preferences.subtitles = subtitles;

    await user.save();

    res.json({
      success: true,
      message: "Preferences updated successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    logger.error("Update preferences error:", error);
    next(error);
  }
};

export const getWatchHistory = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;

    const history = await History.find({ userId: req.user._id })
      .sort({ lastWatched: -1 })
      .limit(parseInt(limit))
      .populate("titleId", "title poster type")
      .populate("episodeId", "number title");

    res.json({
      success: true,
      history,
    });
  } catch (error) {
    logger.error("Get watch history error:", error);
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate("titleId", "title poster type year rating totalEpisodes")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      favorites: favorites.map((f) => f.titleId),
    });
  } catch (error) {
    logger.error("Get favorites error:", error);
    next(error);
  }
};

export const addToFavorites = async (req, res, next) => {
  try {
    const { titleId } = req.params;

    // Check if title exists
    const title = await Title.findById(titleId);
    if (!title) {
      return res.status(404).json({
        success: false,
        message: "Title not found",
      });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: req.user._id,
      titleId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Title already in favorites",
      });
    }

    const favorite = new Favorite({
      userId: req.user._id,
      titleId,
    });

    await favorite.save();

    res.json({
      success: true,
      message: "Added to favorites",
    });
  } catch (error) {
    logger.error("Add to favorites error:", error);
    next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { titleId } = req.params;

    await Favorite.findOneAndDelete({
      userId: req.user._id,
      titleId,
    });

    res.json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    logger.error("Remove from favorites error:", error);
    next(error);
  }
};
