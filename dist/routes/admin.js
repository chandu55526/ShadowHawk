"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const Threat_1 = require("../models/Threat");
const auth_1 = require("../middleware/auth");
const logging_1 = __importDefault(require("../config/logging"));
const mongoose_1 = require("mongoose");
const router = (0, express_1.Router)();
// Apply auth middleware to all admin routes
router.use(auth_1.authenticate, auth_1.isAdmin);
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", async (req, res) => {
    try {
        const users = await User_1.User.find().select("-password");
        res.json(users);
    }
    catch (error) {
        logging_1.default.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * @swagger
 * /api/admin/users/:id:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete("/users/:id", async (req, res) => {
    try {
        const userId = new mongoose_1.Types.ObjectId(req.params.id);
        await User_1.User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        logging_1.default.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * @swagger
 * /api/admin/threats:
 *   get:
 *     summary: Get threat analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Threat analytics data
 */
router.get("/threats", async (req, res) => {
    try {
        const [totalThreats, threatsByType, recentThreats] = await Promise.all([
            Threat_1.Threat.countDocuments(),
            Threat_1.Threat.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
            Threat_1.Threat.find()
                .sort({ timestamp: -1 })
                .limit(10)
                .populate("detectedBy", "email"),
        ]);
        res.json({
            totalThreats,
            threatsByType,
            recentThreats,
        });
    }
    catch (error) {
        logging_1.default.error("Error fetching threat analytics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get API usage statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: API usage statistics
 */
router.get("/stats", async (req, res) => {
    try {
        const [totalUsers, activeUsers, apiCalls] = await Promise.all([
            User_1.User.countDocuments(),
            User_1.User.countDocuments({
                lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            }),
            Threat_1.Threat.countDocuments(),
        ]);
        res.json({
            totalUsers,
            activeUsers,
            apiCalls,
            threatDetectionRate: apiCalls / (totalUsers || 1),
        });
    }
    catch (error) {
        logging_1.default.error("Error fetching stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map