"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logging_1 = __importDefault(require("./logging"));
const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/shadowhawk";
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };
        await mongoose_1.default.connect(mongoUri, options);
        logging_1.default.info("Connected to MongoDB successfully");
        return mongoose_1.default.connection;
    }
    catch (error) {
        logging_1.default.error("MongoDB connection error:", error);
        return null;
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map