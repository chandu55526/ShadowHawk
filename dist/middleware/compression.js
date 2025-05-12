"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compress = void 0;
const compression_1 = __importDefault(require("compression"));
const logging_1 = __importDefault(require("../config/logging"));
const compress = (req, res, next) => {
    try {
        (0, compression_1.default)()(req, res, next);
    }
    catch (err) {
        logging_1.default.error("Compression error:", err);
        next();
    }
};
exports.compress = compress;
//# sourceMappingURL=compression.js.map