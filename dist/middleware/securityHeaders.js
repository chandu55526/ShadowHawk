"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityHeaders = void 0;
const helmet_1 = __importDefault(require("helmet"));
const logging_1 = __importDefault(require("../config/logging"));
const securityHeaders = (req, res, next) => {
    try {
        (0, helmet_1.default)()(req, res, next);
    }
    catch (err) {
        logging_1.default.error("Security headers error:", err);
        next();
    }
};
exports.securityHeaders = securityHeaders;
//# sourceMappingURL=securityHeaders.js.map