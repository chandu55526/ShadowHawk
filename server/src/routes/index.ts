import { Express } from "express";
import { setupAuthRoutes } from "./auth";
import threatRoutes from "./threats";

export const setupRoutes = (app: Express) => {
  setupAuthRoutes(app);
  app.use("/api/threats", threatRoutes);
};
