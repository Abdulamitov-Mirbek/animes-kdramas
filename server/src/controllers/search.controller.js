import Title from "../models/Title.model.js";
import logger from "../utils/logger.js";

export const searchTitles = async (req, res, next) => {
  try {
    const { q, type, genre, year, page = 1, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const query = {
      isActive: true,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { originalTitle: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    };

    if (type) query.type = type;
    if (genre) query.genres = genre;
    if (year) query.year = parseInt(year);

    const titles = await Title.find(query)
      .sort({ "rating.average": -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Title.countDocuments(query);

    res.json({
      success: true,
      titles,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      query: q,
    });
  } catch (error) {
    logger.error("Search error:", error);
    next(error);
  }
};
