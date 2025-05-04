import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Get user profile
router.get("/profile", authMiddleware, (_: Request, res: Response) => {
  return res.json({ profile: "user profile" });
});

export default router;
