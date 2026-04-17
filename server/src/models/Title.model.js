import mongoose from "mongoose";

const titleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    originalTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["drama", "anime"],
      required: true,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed", "hiatus", "cancelled"],
      default: "ongoing",
    },
    year: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    genres: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    poster: {
      url: String,
      publicId: String,
    },
    banner: {
      url: String,
      publicId: String,
    },
    episodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Episode",
      },
    ],
    totalEpisodes: {
      type: Number,
      default: 0,
    },
    releaseDate: {
      type: Date,
    },
    studio: {
      type: String,
    },
    director: {
      type: String,
    },
    cast: [
      {
        name: String,
        role: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
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

// Text search indexes
titleSchema.index({
  title: "text",
  description: "text",
  originalTitle: "text",
});
titleSchema.index({ type: 1, year: -1 });
titleSchema.index({ genres: 1 });
titleSchema.index({ status: 1 });

// Check if model already exists to avoid overwriting
const Title = mongoose.models.Title || mongoose.model("Title", titleSchema);

export default Title;
