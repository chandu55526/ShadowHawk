import { Request, Response } from "express";
import compression from "compression";
import logger from "../config/logging";

// Compression filter function
const shouldCompress = (req: Request, res: Response) => {
  // Don't compress responses with this request header
  if (req.headers["x-no-compression"]) {
    return false;
  }

  // Use compression
  return compression.filter(req, res);
};

// Compression middleware
export const compress = compression({
  filter: shouldCompress,
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses larger than 1KB
  memLevel: 8, // Memory level (1-9)
  strategy: 0, // Compression strategy
  chunkSize: 16384, // Chunk size
  windowBits: 15, // Window bits
  onError: (err: Error) => {
    logger.error("Compression error:", err);
  },
});
