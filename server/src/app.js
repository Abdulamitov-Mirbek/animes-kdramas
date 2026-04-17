import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import { rateLimit } from "express-rate-limit";

import authRoutes from "./api/auth.routes.js";
import userRoutes from "./api/user.routes.js";
import titlesRoutes from "./api/titles.routes.js";
import episodesRoutes from "./api/episodes.routes.js";
import searchRoutes from "./api/search.routes.js";
import adminRoutes from "./api/admin.routes.js";
import commentRoutes from"./api/comment.routes.js";

import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(compression());

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/titles", titlesRoutes);
app.use("/api/episodes", episodesRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/comments', commentRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    name: "Kdramas & Animes API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      titles: "/api/titles",
      episodes: "/api/episodes",
      search: "/api/search",
      admin: "/api/admin",
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
