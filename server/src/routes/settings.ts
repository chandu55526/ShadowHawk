import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Get settings
router.get("/", authMiddleware, (_: Request, res: Response) => {
  return res.json({ settings: "user settings" });
});

// Update settings
router.put("/", authMiddleware, (req: Request, res: Response) => {
  return res.json(req.body);
});

export default router;
