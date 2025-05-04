import express from "express";
import promClient from "prom-client";

// Create a Registry to register metrics
const register = new promClient.Registry();

// Create a counter for threat detections
const threatDetectionCounter = new promClient.Counter({
  name: "threat_detection_total",
  help: "Total number of threat detections",
  registers: [register],
});

export const incrementThreatDetection = () => {
  threatDetectionCounter.inc();
};

export const setupMonitoring = (app: express.Express) => {
  // Expose metrics endpoint
  app.get("/metrics", async (_, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  });
};
