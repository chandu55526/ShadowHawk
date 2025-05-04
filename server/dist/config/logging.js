"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const env_1 = require("./env");
const { combine, timestamp, printf, colorize, json } = winston_1.default.format;
// Custom format
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});
// Create logger instance
const logger = winston_1.default.createLogger({
    level: env_1.env.LOG_LEVEL,
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }), json()),
    transports: [
        // Console transport
        new winston_1.default.transports.Console({
            format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }), logFormat),
        }),
        // File transport for all logs
        new winston_1.default.transports.File({
            filename: env_1.env.LOG_FILE,
            format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }), json()),
        }),
        // File transport for error logs
        new winston_1.default.transports.File({
            filename: env_1.env.ERROR_LOG_FILE,
            level: "error",
            format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss:SSS" }), json()),
        }),
    ],
});
// Create a stream object with a 'write' function that will be used by Morgan
exports.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
exports.default = logger;
//# sourceMappingURL=logging.js.map