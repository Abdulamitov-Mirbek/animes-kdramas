import Title from "../models/Title.model.js";
import Episode from "../models/Episode.model.js";
import logger from "../utils/logger.js";

// Get all titles
export const getTitles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      genre,
      year,
      status,
      sort = "-createdAt",
    } = req.query;

    const query = { isActive: true };

    if (type) query.type = type;
    if (genre) query.genres = genre;
    if (year) query.year = year;
    if (status) query.status = status;

    const titles = await Title.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("episodes", "number title duration");

    const total = await Title.countDocuments(query);

    res.json({
      success: true,
      titles,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    logger.error("Get titles error:", error);
    next(error);
  }
};

// Get single title by ID
export const getTitleById = async (req, res, next) => {
  try {
    const title = await Title.findById(req.params.id).populate({
      path: "episodes",
      match: { isActive: true },
      options: { sort: { number: 1 } },
    });

    if (!title) {
      return res.status(404).json({
        success: false,
        message: "Title not found",
      });
    }

    // Increment views
    title.views += 1;
    await title.save();

    res.json({
      success: true,
      title,
    });
  } catch (error) {
    logger.error("Get title by ID error:", error);
    next(error);
  }
};

// Get trending titles
export const getTrendingTitles = async (req, res, next) => {
  try {
    const titles = await Title.find({ isActive: true })
      .sort({ views: -1, "rating.average": -1 })
      .limit(12)
      .populate("episodes", "number");

    res.json({
      success: true,
      titles,
    });
  } catch (error) {
    logger.error("Get trending titles error:", error);
    next(error);
  }
};

// Get recent titles
export const getRecentTitles = async (req, res, next) => {
  try {
    const titles = await Title.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .populate("episodes", "number");

    res.json({
      success: true,
      titles,
    });
  } catch (error) {
    logger.error("Get recent titles error:", error);
    next(error);
  }
};

// Create new title
export const createTitle = async (req, res, next) => {
  try {
    const titleData = req.body;

    // Handle poster upload if file exists
    if (req.file) {
      titleData.poster = {
        url: `/uploads/images/${req.file.filename}`,
        publicId: req.file.filename,
      };
    }

    const title = new Title(titleData);
    await title.save();

    res.status(201).json({
      success: true,
      message: "Title created successfully",
      title,
    });
  } catch (error) {
    logger.error("Create title error:", error);
    next(error);
  }
};

// Update title
export const updateTitle = async (req, res, next) => {
  try {
    const title = await Title.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!title) {
      return res.status(404).json({
        success: false,
        message: "Title not found",
      });
    }

    res.json({
      success: true,
      message: "Title updated successfully",
      title,
    });
  } catch (error) {
    logger.error("Update title error:", error);
    next(error);
  }
};

// Delete title (soft delete)
export const deleteTitle = async (req, res, next) => {
  try {
    const title = await Title.findById(req.params.id);

    if (!title) {
      return res.status(404).json({
        success: false,
        message: "Title not found",
      });
    }

    // Soft delete
    title.isActive = false;
    await title.save();

    // Also soft delete all episodes
    await Episode.updateMany({ titleId: req.params.id }, { isActive: false });

    res.json({
      success: true,
      message: "Title deleted successfully",
    });
  } catch (error) {
    logger.error("Delete title error:", error);
    next(error);
  }
};

// Get titles by genre
export const getTitlesByGenre = async (req, res, next) => {
  try {
    const { genre } = req.params;
    const titles = await Title.find({
      isActive: true,
      genres: genre,
    })
      .sort({ "rating.average": -1 })
      .limit(20);

    res.json({
      success: true,
      titles,
    });
  } catch (error) {
    logger.error("Get titles by genre error:", error);
    next(error);
  }
};

// Get recommendations for user
export const getRecommendations = async (req, res, next) => {
  try {
    // Simple recommendation based on highest rated
    const titles = await Title.find({ isActive: true })
      .sort({ "rating.average": -1, views: -1 })
      .limit(10);

    res.json({
      success: true,
      titles,
    });
  } catch (error) {
    logger.error("Get recommendations error:", error);
    next(error);
  }
};
