import { Request, Response, NextFunction } from "express";
import { json, urlencoded } from "express";
import logger from "../config/logging";

export const bodyParser = (req: Request, res: Response, next: NextFunction) => {
  try {
    json()(req, res, (err) => {
      if (err) {
        logger.error("JSON body parser error:", err);
        return res.status(400).json({
          error: "Invalid JSON",
          message: "The request body contains invalid JSON",
        });
      }
      urlencoded({ extended: true })(req, res, next);
    });
  } catch (err) {
    logger.error("Body parser error:", err);
    next();
  }
};
