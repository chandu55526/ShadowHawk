import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const setupAuthRoutes = (app: any) => {
  const router = Router();

  // Register
  router.post("/register", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword });
      return res.status(201).json({ id: user._id, email: user.email });
    } catch (error) {
      return res.status(400).json({ error: "Registration failed" });
    }
  });

  // Login
  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      return res.json({ token });
    } catch (error) {
      return res.status(400).json({ error: "Login failed" });
    }
  });

  app.use("/api/auth", router);
};
