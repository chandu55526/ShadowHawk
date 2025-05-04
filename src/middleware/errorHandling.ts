import { Express, Request, Response, NextFunction } from "express";
import logger from "../config/logging";

interface CustomError extends Error {
  status?: number;
  errors?: any[];
}

export const setupErrorHandling = (app: Express) => {
  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: "Not Found",
      message: `Cannot ${req.method} ${req.path}`,
    });
  });

  // Global error handler
  app.use((err: CustomError, req: Request, res: Response, _next: NextFunction) => {
    logger.error("Error:", {
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
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  });
}; 