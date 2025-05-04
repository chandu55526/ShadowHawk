"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logging_1 = __importDefault(require("./logging"));
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
const connectDatabase = async () => {
    if (isConnected) {
        return mongoose_1.default.connection;
    }
    try {
        logging_1.default.info("Attempting to connect to MongoDB...");
        // Connect to MongoDB with retry logic
        while (retryCount < MAX_RETRIES) {
            try {
                await mongoose_1.default.connect(MONGODB_URI, options);
                isConnected = true;
                logging_1.default.info("Connected to MongoDB successfully");
                break;
            }
            catch (error) {
                retryCount++;
                logging_1.default.warn(`Connection attempt ${retryCount} failed:`, error);
                if (retryCount === MAX_RETRIES) {
                    logging_1.default.warn("Max retries reached. Starting server in degraded mode...");
                    return null;
                }
                // Wait before retrying (exponential backoff)
                await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            }
        }
        // Handle connection events
        mongoose_1.default.connection.on("error", (err) => {
            logging_1.default.error("MongoDB connection error:", err);
            isConnected = false;
        });
        mongoose_1.default.connection.on("disconnected", () => {
            logging_1.default.warn("MongoDB disconnected");
            isConnected = false;
        });
        mongoose_1.default.connection.on("reconnected", () => {
            logging_1.default.info("MongoDB reconnected");
            isConnected = true;
        });
        return mongoose_1.default.connection;
    }
    catch (error) {
        logging_1.default.error("MongoDB connection error:", error);
        if (error instanceof Error) {
            logging_1.default.error("Error details:", {
                name: error.name,
                message: error.message,
                stack: error.stack,
            });
        }
        return null;
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map