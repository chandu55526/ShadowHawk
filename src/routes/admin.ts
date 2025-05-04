import { Router } from "express";
import { User } from "../models/User";
import { Threat } from "../models/Threat";
import { authenticate, isAdmin } from "../middleware/auth";
import logger from "../config/logging";
import { Types } from "mongoose";

const router = Router();

// Apply auth middleware to all admin routes
router.use(authenticate, isAdmin);

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
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    logger.error("Error fetching users:", error);
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
    const userId = new Types.ObjectId(req.params.id);
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("Error deleting user:", error);
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
      Threat.countDocuments(),
      Threat.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
      Threat.find()
        .sort({ timestamp: -1 })
        .limit(10)
        .populate("detectedBy", "email"),
    ]);

    res.json({
      totalThreats,
      threatsByType,
      recentThreats,
    });
  } catch (error) {
    logger.error("Error fetching threat analytics:", error);
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
      User.countDocuments(),
      User.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
      Threat.countDocuments(),
    ]);

    res.json({
      totalUsers,
      activeUsers,
      apiCalls,
      threatDetectionRate: apiCalls / (totalUsers || 1),
    });
  } catch (error) {
    logger.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
