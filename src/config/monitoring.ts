import { Request, Response, NextFunction } from "express";
import { register, Counter, Histogram } from "prom-client";
import responseTime from "response-time";
import logger from "./logging";

// Initialize metrics
const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

const httpRequestDurationSeconds = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
});

export const setupMonitoring = (app: any) => {
  // Record metrics for each request
  app.use(responseTime((req: Request, res: Response, time: number) => {
    const route = (req as any).route?.path || req.path;
    const method = req.method;
    const status = res.statusCode;

    try {
      httpRequestsTotal.inc({
        method,
        route,
        status: status.toString(),
      });

      httpRequestDurationSeconds.observe(
        {
          method,
          route,
          status: status.toString(),
        },
        time / 1000
      );
    } catch (error) {
      logger.error("Error recording metrics:", error);
    }
  }));

  // Expose metrics endpoint
  app.get("/metrics", async (req: Request, res: Response) => {
    try {
      res.set("Content-Type", register.contentType);
      res.end(await register.metrics());
    } catch (error) {
      logger.error("Error serving metrics:", error);
      res.status(500).end();
    }
  });
};
