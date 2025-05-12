"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupErrorHandling = void 0;
const logging_1 = __importDefault(require("../config/logging"));
const setupErrorHandling = (app) => {
    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            error: "Not Found",
            message: `Cannot ${req.method} ${req.path}`,
        });
    });
    // Global error handler
    app.use((err, req, res, _next) => {
        logging_1.default.error("Error:", {
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
            ip: req.ip,
        });
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
        // Default error response
        res.status(err.status || 500).json({
            error: "Internal Server Error",
            message: process.env.NODE_ENV === "development"
                ? err.message
                : "Something went wrong",
        });
    });
};
exports.setupErrorHandling = setupErrorHandling;
//# sourceMappingURL=errorHandling.js.map