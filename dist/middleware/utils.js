"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValidationError = exports.logError = exports.getClientIp = void 0;
const logging_1 = __importDefault(require("../config/logging"));
const getClientIp = (req) => {
    const forwardedFor = req.headers["x-forwarded-for"];
    if (typeof forwardedFor === "string") {
        return forwardedFor.split(",")[0].trim();
    }
    return req.ip || "unknown";
};
exports.getClientIp = getClientIp;
const logError = (err, req) => {
    logging_1.default.error("Error:", {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: (0, exports.getClientIp)(req),
    });
};
exports.logError = logError;
const formatValidationError = (errors) => {
    return errors.map((error) => ({
        path: error.path.join("."),
        message: error.message,
    }));
};
exports.formatValidationError = formatValidationError;
//# sourceMappingURL=utils.js.map