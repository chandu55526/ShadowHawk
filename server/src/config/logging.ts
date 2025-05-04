import winston from "winston";
import { env } from "./env";

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

// Create logger instance
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }), json()),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }),
        logFormat,
      ),
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: env.LOG_FILE,
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }), json()),
    }),
    // File transport for error logs
    new winston.transports.File({
      filename: env.ERROR_LOG_FILE,
      level: "error",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }), json()),
    }),
  ],
});

// Create a stream object with a 'write' function that will be used by Morgan
export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
