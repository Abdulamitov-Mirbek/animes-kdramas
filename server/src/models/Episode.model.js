import mongoose from "mongoose";

const episodeSchema = new mongoose.Schema(
  {
    titleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Title",
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 0,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    videoQuality: {
      type: String,
      enum: ["360p", "480p", "720p", "1080p", "4k"],
      default: "720p",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    subtitles: [
      {
        language: String,
        url: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    releaseDate: {
      type: Date,
      default: Date.now,
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

// Ensure unique episode number per title
episodeSchema.index({ titleId: 1, number: 1 }, { unique: true });

const Episode =
  mongoose.models.Episode || mongoose.model("Episode", episodeSchema);

export default Episode;
