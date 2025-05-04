"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUncaughtException = exports.handleUnhandledRejection = exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
// Custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Error handling middleware
const errorHandler = (err, _req, res, _next) => {
    logger_1.logger.error('Error:', err);
    if (res.headersSent) {
        return;
    }
    // Handle specific error types
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: err.message
        });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized access'
        });
    }
    // Default error response
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};
exports.errorHandler = errorHandler;
// Handle unhandled rejections
const handleUnhandledRejection = (err) => {
    logger_1.logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
    logger_1.logger.error("Error:", err);
    process.exit(1);
};
exports.handleUnhandledRejection = handleUnhandledRejection;
// Handle uncaught exceptions
const handleUncaughtException = (err) => {
    logger_1.logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    logger_1.logger.error("Error:", err);
    process.exit(1);
};
exports.handleUncaughtException = handleUncaughtException;
//# sourceMappingURL=errorHandler.js.map