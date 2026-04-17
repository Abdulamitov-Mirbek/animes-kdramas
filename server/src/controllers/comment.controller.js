import Comment from "../models/comment.model.js";
import logger from "../utils/logger.js";

export const getComments = async (req, res, next) => {
  try {
    const { episodeId } = req.params;
    const comments = await Comment.find({ episodeId, parentId: null })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });

    // Получаем количество лайков для каждого комментария
    const commentsWithCount = comments.map((comment) => ({
      ...comment.toObject(),
      likesCount: comment.likes?.length || 0,
      isLikedByUser: req.user ? comment.likes?.includes(req.user._id) : false,
    }));

    res.json({
      success: true,
      comments: commentsWithCount,
    });
  } catch (error) {
    logger.error("Get comments error:", error);
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { episodeId } = req.params;
    const { content, parentId } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const comment = new Comment({
      userId: req.user._id,
      episodeId,
      content: content.trim(),
      parentId: parentId || null,
    });

    await comment.save();
    await comment.populate("userId", "username avatar");

    res.status(201).json({
      success: true,
      comment: {
        ...comment.toObject(),
        likesCount: 0,
        isLikedByUser: false,
      },
    });
  } catch (error) {
    logger.error("Add comment error:", error);
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const userId = req.user._id;
    const likeIndex = comment.likes.indexOf(userId);

    if (likeIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();

    res.json({
      success: true,
      likesCount: comment.likes.length,
      isLiked: likeIndex === -1,
    });
  } catch (error) {
    logger.error("Like comment error:", error);
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Проверяем, что пользователь является автором комментария
    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
    }

    // Удаляем комментарий
    await comment.deleteOne();

    // Также удаляем все ответы на этот комментарий
    await Comment.deleteMany({ parentId: id });

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    logger.error("Delete comment error:", error);
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Проверяем, что пользователь является автором комментария
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own comments",
      });
    }

    comment.content = content;
    comment.isEdited = true;
    await comment.save();

    await comment.populate("userId", "username avatar");

    res.json({
      success: true,
      comment: {
        ...comment.toObject(),
        likesCount: comment.likes?.length || 0,
      },
    });
  } catch (error) {
    logger.error("Update comment error:", error);
    next(error);
  }
};
