import winston from "winston";
import express from "express";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

export { logger };

export const setupLogging = (app: express.Application) => {
  app.use((req: express.Request, _: express.Response, next: express.NextFunction) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
};
