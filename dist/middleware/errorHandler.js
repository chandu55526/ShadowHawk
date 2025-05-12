"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logging_1 = __importDefault(require("../config/logging"));
const errorHandler = (err, req, res, _next) => {
    logging_1.default.error("Error:", err);
    // Log stack trace in development
    if (process.env.NODE_ENV === "development") {
        logging_1.default.error(err.stack);
    }
    // Handle validation errors
    if (err.name === "ValidationError") {
        return res.status(400).json({
            error: "Validation Error",
            details: err.errors,
        });
    }
    // Handle unauthorized errors
    if (err.name === "UnauthorizedError") {
        return res.status(401).json({
            error: "Unauthorized",
            message: err.message,
        });
    }
    // Default error
    res.status(err.status || 500).json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === "development"
            ? err.message
            : "Something went wrong",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map