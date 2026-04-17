import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    titleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Title",
      required: true,
    },
    episodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

commentSchema.index({ titleId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
                