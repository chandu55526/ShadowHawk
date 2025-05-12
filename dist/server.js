"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = require("./config/database");
const logging_1 = __importDefault(require("./config/logging"));
const routes_1 = require("./routes");
const errorHandling_1 = require("./middleware/errorHandling");
const health_1 = __importDefault(require("./routes/health"));
const docs_1 = __importDefault(require("./routes/docs"));
const admin_1 = __importDefault(require("./routes/admin"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
const errorHandler_1 = require("./middleware/errorHandler");
const monitoring_1 = require("./config/monitoring");
const cache_1 = require("./middleware/cache");
const security_1 = require("./config/security");
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 5001;
// Basic middleware with memory limits
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "1mb" }));
app.use((0, morgan_1.default)("dev"));
// Apply security middleware
(0, security_1.applySecurityMiddleware)(app);
// Setup caching
(0, cache_1.setupCache)(app);
// Setup monitoring
(0, monitoring_1.setupMonitoring)(app);
// API Documentation
app.use("/", docs_1.default);
// Health check
app.use("/api/health", health_1.default);
// Admin routes
app.use("/api/admin", admin_1.default);
// Webhook routes
app.use("/api/webhooks", webhooks_1.default);
// Setup routes
(0, routes_1.setupRoutes)(app);
// Error handling should be last
(0, errorHandling_1.setupErrorHandling)(app);
app.use(errorHandler_1.errorHandler);
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    logging_1.default.error("Uncaught Exception:", error);
    // Give time for logger to write
    setTimeout(() => process.exit(1), 1000);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    logging_1.default.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Give time for logger to write
    setTimeout(() => process.exit(1), 1000);
});
// Graceful shutdown
const shutdown = async () => {
    logging_1.default.info("Shutting down server...");
    try {
        // Close database connection if exists
        const dbConnection = await (0, database_1.connectDatabase)();
        if (dbConnection) {
            await dbConnection.close();
        }
        process.exit(0);
    }
    catch (error) {
        logging_1.default.error("Error during shutdown:", error);
        process.exit(1);
    }
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
// Start server
const startServer = async () => {
    try {
        // Connect to database
        const dbConnection = await (0, database_1.connectDatabase)();
        if (!dbConnection) {
            logging_1.default.warn("Failed to connect to database. Starting server in degraded mode...");
        }
        // Start the server
        const server = app.listen(PORT, () => {
            logging_1.default.info(`Server running on port ${PORT}`);
            logging_1.default.info("Press Ctrl+C to stop the server");
        });
        // Handle server errors
        server.on("error", (error) => {
            logging_1.default.error("Server error:", error);
            shutdown();
        });
        // Handle process termination
        process.on("SIGTERM", () => {
            logging_1.default.info("SIGTERM received. Shutting down gracefully...");
            shutdown();
        });
        process.on("SIGINT", () => {
            logging_1.default.info("SIGINT received. Shutting down gracefully...");
            shutdown();
        });
    }
    catch (error) {
        logging_1.default.error("Failed to start server:", error);
        shutdown();
    }
};
// Start the server
startServer().catch((error) => {
    logging_1.default.error("Fatal error during server startup:", error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map