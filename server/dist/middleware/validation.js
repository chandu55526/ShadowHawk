"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.threatDetectionSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
// Login schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters long"),
});
// Threat detection schema
exports.threatDetectionSchema = zod_1.z.object({
    url: zod_1.z.string().url("Invalid URL format"),
});
// Validation middleware
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                return res.status(400).json({ error: error.errors[0].message });
            }
            return next(error);
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validation.js.map