import { Request, Response, NextFunction } from "express";
import cors from "cors";
import logger from "../config/logging";
import { CORS } from "./constants";

const corsOptions = {
  origin: CORS.ORIGIN,
  methods: CORS.METHODS,
  allowedHeaders: CORS.ALLOWED_HEADERS,
  credentials: CORS.CREDENTIALS,
  maxAge: CORS.MAX_AGE,
};

export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    cors(corsOptions)(req, res, next);
  } catch (err) {
    logger.error("CORS error:", err);
    next();
  }
};
