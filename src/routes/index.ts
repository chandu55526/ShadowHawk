import { Express } from "express";
import healthRouter from "./health";
import docsRouter from "./docs";
import adminRouter from "./admin";
import webhookRouter from "./webhooks";

export const setupRoutes = (app: Express) => {
  app.use("/api/health", healthRouter);
  app.use("/api/docs", docsRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/webhooks", webhookRouter);
}; 