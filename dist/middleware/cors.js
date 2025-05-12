"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const logging_1 = __importDefault(require("../config/logging"));
const constants_1 = require("./constants");
const corsOptions = {
    origin: constants_1.CORS.ORIGIN,
    methods: constants_1.CORS.METHODS,
    allowedHeaders: constants_1.CORS.ALLOWED_HEADERS,
    credentials: constants_1.CORS.CREDENTIALS,
    maxAge: constants_1.CORS.MAX_AGE,
};
const corsMiddleware = (req, res, next) => {
    try {
        (0, cors_1.default)(corsOptions)(req, res, next);
    }
    catch (err) {
        logging_1.default.error("CORS error:", err);
        next();
    }
};
exports.corsMiddleware = corsMiddleware;
//# sourceMappingURL=cors.js.map