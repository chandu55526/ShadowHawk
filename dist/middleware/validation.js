"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const logging_1 = __importDefault(require("../config/logging"));
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            logging_1.default.error("Validation error:", error);
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    error: "Validation Error",
                    details: error.errors.map((e) => ({
                        path: e.path.join("."),
                        message: e.message,
                    })),
                });
            }
            else {
                next(error);
            }
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validation.js.map