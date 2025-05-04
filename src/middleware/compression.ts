import { Request, Response, NextFunction } from "express";
import compression from "compression";
import logger from "../config/logging";

export const compress = (req: Request, res: Response, next: NextFunction) => {
  try {
    compression()(req, res, next);
  } catch (err) {
    logger.error("Compression error:", err);
    next();
  }
};
