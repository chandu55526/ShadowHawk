import { Express } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";
import logger from "../config/logging";

// Create Redis client with retry strategy
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        logger.warn("Redis connection failed after 3 retries");
        return new Error("Redis connection failed");
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

// Handle Redis connection events
redisClient.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
  logger.info("Redis connected successfully");
});

redisClient.on("reconnecting", () => {
  logger.info("Redis reconnecting...");
});

// Connect to Redis
redisClient.connect().catch((err) => {
  logger.error("Redis connection error:", err);
});

// General API rate limiter
export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for authentication routes
export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const setupRateLimiting = (app: Express) => {
  // Apply rate limiting
  app.use(apiLimiter);
  app.use("/api/auth/*", authLimiter);
};
