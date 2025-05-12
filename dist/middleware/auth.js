"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logging_1 = __importDefault(require("../config/logging"));
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("No token provided");
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        req.user = decoded;
        next();
    }
    catch (error) {
        logging_1.default.error("Authentication error:", error);
        res.status(401).json({
            error: "Unauthorized",
            message: "Invalid or expired token",
        });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                throw new Error("User not authenticated");
            }
            if (!roles.includes(req.user.role)) {
                throw new Error("Insufficient permissions");
            }
            next();
        }
        catch (error) {
            logging_1.default.error("Authorization error:", error);
            res.status(403).json({
                error: "Forbidden",
                message: "Insufficient permissions",
            });
        }
    };
};
exports.authorize = authorize;
// Convenience middleware for admin routes
exports.isAdmin = (0, exports.authorize)(["admin"]);
//# sourceMappingURL=auth.js.map