"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compress = void 0;
const compression_1 = __importDefault(require("compression"));
const logging_1 = __importDefault(require("../config/logging"));
// Compression filter function
const shouldCompress = (req, res) => {
    // Don't compress responses with this request header
    if (req.headers["x-no-compression"]) {
        return false;
    }
    // Use compression
    return compression_1.default.filter(req, res);
};
// Compression middleware
exports.compress = (0, compression_1.default)({
    filter: shouldCompress,
    level: 6, // Compression level (0-9)
    threshold: 1024, // Only compress responses larger than 1KB
    memLevel: 8, // Memory level (1-9)
    strategy: 0, // Compression strategy
    chunkSize: 16384, // Chunk size
    windowBits: 15, // Window bits
    onError: (err) => {
        logging_1.default.error("Compression error:", err);
    },
});
//# sourceMappingURL=compression.js.map