import User from "../models/User.model.js";
import Title from "../models/Title.model.js";
import Episode from "../models/Episode.model.js";
import logger from "../utils/logger.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTitles = await Title.countDocuments({ isActive: true });
    const totalEpisodes = await Episode.countDocuments({ isActive: true });
    const totalViews = await Title.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);

    const recentTitles = await Title.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        users: totalUsers,
        titles: totalTitles,
        episodes: totalEpisodes,
        views: totalViews[0]?.total || 0,
      },
      recentTitles,
    });
  } catch (error) {
    logger.error("Get dashboard stats error:", error);
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    logger.error("Get all users error:", error);
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Update user role error:", error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Soft delete
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error("Delete user error:", error);
    next(error);
  }
};

export const getSystemLogs = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: "Logs endpoint - implement log reading logic",
    });
  } catch (error) {
    logger.error("Get system logs error:", error);
    next(error);
  }
};

// Add new title with poster upload
export const addTitle = async (req, res, next) => {
  try {
    const titleData = req.body;

    // Handle poster upload if file exists
    if (req.file) {
      titleData.poster = {
        url: `/uploads/${req.file.filename}`,
        publicId: req.file.filename,
      };
    }

    const title = new Title(titleData);
    await title.save();

    res.status(201).json({
      success: true,
      message: "Title added successfully",
      title,
    });
  } catch (error) {
    logger.error("Add title error:", error);
    next(error);
  }
};

// Add episode to title
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

    // Handle video upload if file exists
    if (req.file) {
      episodeData.videoUrl = `/uploads/${req.file.filename}`;
    }

    const episode = new Episode({
      ...episodeData,
      titleId,
    });

    await episode.save();

    // Update title's episodes array
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
