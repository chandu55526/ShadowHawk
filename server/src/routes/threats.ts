import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Get all threats
router.get("/", authMiddleware, (_: Request, res: Response) => {
  return res.json({ threats: [] });
});

// Get threat by ID
router.get("/:id", authMiddleware, (_: Request, res: Response) => {
  return res.json({ threat: { id: "1", status: "detected" } });
});

// Update threat status
router.put("/:id", authMiddleware, (_: Request, res: Response) => {
  return res.json({ message: "Threat status updated" });
});

export default router;
