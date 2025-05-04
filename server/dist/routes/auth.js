"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAuthRoutes = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const setupAuthRoutes = (app) => {
    const router = (0, express_1.Router)();
    // Register
    router.post("/register", async (req, res) => {
        try {
            const { email, password } = req.body;
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = await User_1.User.create({ email, password: hashedPassword });
            return res.status(201).json({ id: user._id, email: user.email });
        }
        catch (error) {
            return res.status(400).json({ error: "Registration failed" });
        }
    });
    // Login
    router.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const isValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            return res.json({ token });
        }
        catch (error) {
            return res.status(400).json({ error: "Login failed" });
        }
    });
    app.use("/api/auth", router);
};
exports.setupAuthRoutes = setupAuthRoutes;
//# sourceMappingURL=auth.js.map