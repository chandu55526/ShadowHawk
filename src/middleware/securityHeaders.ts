import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import logger from "../config/logging";

export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    helmet()(req, res, next);
  } catch (err) {
    logger.error("Security headers error:", err);
    next();
  }
};
