import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { connectDatabase } from "./config/database";
import logger from "./config/logging";
import { setupRoutes } from "./routes";
import { setupErrorHandling } from "./middleware/errorHandling";
import healthRouter from "./routes/health";
import docsRouter from "./routes/docs";
import { errorHandler } from "./middleware/errorHandler";
import { setupRateLimiting } from './middleware/rateLimit';
import monitoringRouter from './routes/monitoring';

const app = express();
const PORT = process.env.PORT || 5001;

// Basic middleware with memory limits
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(morgan("dev"));

// API Documentation
app.use("/", docsRouter);

// Routes
app.use("/api/health", healthRouter);
setupRoutes(app);

// Setup error handling
setupErrorHandling(app);

// Rate limiting
setupRateLimiting(app);

// Routes
app.use('/api/monitoring', monitoringRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  // Give time for logger to write
  setTimeout(() => process.exit(1), 1000);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Give time for logger to write
  setTimeout(() => process.exit(1), 1000);
});

// Graceful shutdown
const shutdown = async () => {
  logger.info("Shutting down server...");
  try {
    // Close database connection if exists
    const dbConnection = await connectDatabase();
    if (dbConnection) {
      await dbConnection.close();
    }
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    const dbConnection = await connectDatabase();
    if (!dbConnection) {
      logger.warn(
        "Failed to connect to database. Starting server in degraded mode...",
      );
    }

    // Start the server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info("Press Ctrl+C to stop the server");
    });

    // Handle server errors
    server.on("error", (error) => {
      logger.error("Server error:", error);
      shutdown();
    });

    // Handle process termination
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Shutting down gracefully...");
      shutdown();
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received. Shutting down gracefully...");
      shutdown();
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    shutdown();
  }
};

// Start the server
startServer().catch((error) => {
  logger.error("Fatal error during server startup:", error);
  process.exit(1);
});

// Export app for testing
export { app };
