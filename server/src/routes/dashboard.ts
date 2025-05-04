import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Get dashboard stats
router.get("/stats", authMiddleware, (_: Request, res: Response) => {
  return res.json({ stats: "dashboard stats" });
});

export default router;
