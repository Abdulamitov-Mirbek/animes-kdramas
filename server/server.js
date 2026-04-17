import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";
import { connectRedis } from "./src/config/redis.js";
import logger from "./src/utils/logger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    await connectRedis();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🎬 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
