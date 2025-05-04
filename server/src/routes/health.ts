import { Router, Request, Response } from "express";

const router = Router();

router.get("/health", (_: Request, res: Response) => {
  return res.json({ status: "ok" });
});

export default router;
