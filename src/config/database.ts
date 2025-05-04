import mongoose from "mongoose";
import logger from "./logging";

export const connectDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/shadowhawk";
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoUri, options);
    logger.info("Connected to MongoDB successfully");
    return mongoose.connection;
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    return null;
  }
};
