import mongoose from "mongoose";
import logger from "./logging";

// Default MongoDB URI
const DEFAULT_MONGODB_URI = "mongodb://localhost:27017/shadowhawk";

// Get MongoDB URI from environment or use default
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

// Connection options
const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  maxPoolSize: 5,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
};

let isConnected = false;
let retryCount = 0;
const MAX_RETRIES = 3;

export const connectDatabase = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    logger.info("Attempting to connect to MongoDB...");

    // Connect to MongoDB with retry logic
    while (retryCount < MAX_RETRIES) {
      try {
        await mongoose.connect(MONGODB_URI, options);
        isConnected = true;
        logger.info("Connected to MongoDB successfully");
        break;
      } catch (error) {
        retryCount++;
        logger.warn(`Connection attempt ${retryCount} failed:`, error);

        if (retryCount === MAX_RETRIES) {
          logger.warn(
            "Max retries reached. Starting server in degraded mode...",
          );
          return null;
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retryCount) * 1000),
        );
      }
    }

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
      isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
      isConnected = true;
    });

    return mongoose.connection;
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    if (error instanceof Error) {
      logger.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return null;
  }
};
