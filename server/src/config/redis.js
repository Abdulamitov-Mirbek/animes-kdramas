import Redis from "redis";
import logger from "../utils/logger.js";

let redisClient = null;

export const connectRedis = async () => {
  try {
    redisClient = Redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => {
      logger.warn("Redis Client Error:", err.message);
    });

    redisClient.on("connect", () => {
      logger.info("✅ Redis connected");
    });

    await redisClient.connect();
  } catch (error) {
    logger.warn("Redis connection failed, continuing without cache");
    redisClient = null;
  }
};

export const getRedisClient = () => redisClient;

// Функции для кэширования
export const cacheGet = async (key) => {
  if (!redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

export const cacheSet = async (key, data, ttl = 3600) => {
  if (!redisClient) return;
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (error) {
    // Silent fail
  }
};

export const cacheDelete = async (pattern) => {
  if (!redisClient) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length) {
      await redisClient.del(keys);
    }
  } catch (error) {
    // Silent fail
  }
};
