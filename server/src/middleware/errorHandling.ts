import { Express, Request, Response, NextFunction } from "express";
import logger from "../config/logging";
import { errorHandler } from "./errorHandler";

export const setupErrorHandling = (app: Express) => {
  // Log errors
  app.use((err: Error, _: Request, __: Response, next: NextFunction) => {
    logger.error(err.stack);
    next(err);
  });

  // Handle errors
  app.use(errorHandler);
};
