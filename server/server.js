// server.js
import dotenv from 'dotenv';
dotenv.config();  // Call config() explicitly

import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";
import { connectRedis } from "./src/config/redis.js";
import logger from "./src/utils/logger.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debug: Check if loaded
    
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