"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyParser = void 0;
const express_1 = require("express");
const logging_1 = __importDefault(require("../config/logging"));
const bodyParser = (req, res, next) => {
    try {
        (0, express_1.json)()(req, res, (err) => {
            if (err) {
                logging_1.default.error("JSON body parser error:", err);
                return res.status(400).json({
                    error: "Invalid JSON",
                    message: "The request body contains invalid JSON",
                });
            }
            (0, express_1.urlencoded)({ extended: true })(req, res, next);
        });
    }
    catch (err) {
        logging_1.default.error("Body parser error:", err);
        next();
    }
};
exports.bodyParser = bodyParser;
//# sourceMappingURL=bodyParser.js.map