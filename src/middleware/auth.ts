import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../config/logging";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as { id: string; role: string };

    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token",
    });
  }
};

export const authorize = (roles: string[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        throw new Error("User not authenticated");
      }

      if (!roles.includes(req.user.role)) {
        throw new Error("Insufficient permissions");
      }

      next();
    } catch (error) {
      logger.error("Authorization error:", error);
      res.status(403).json({
        error: "Forbidden",
        message: "Insufficient permissions",
      });
    }
  };
};

// Convenience middleware for admin routes
export const isAdmin = authorize(["admin"]);
