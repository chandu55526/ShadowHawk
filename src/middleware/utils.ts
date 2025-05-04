import { Request } from "express";
import logger from "../config/logging";

export const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0].trim();
  }
  return req.ip || "unknown";
};

export const logError = (err: Error, req: Request): void => {
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: getClientIp(req),
  });
};

export const formatValidationError = (errors: any[]): any[] => {
  return errors.map((error) => ({
    path: error.path.join("."),
    message: error.message,
  }));
};
