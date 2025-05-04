import promClient from "prom-client";

// Create a Registry to register metrics
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({
  register,
  prefix: "shadowhawk_",
});

// Custom metrics
const threatDetections = new promClient.Counter({
  name: "shadowhawk_threat_detections_total",
  help: "Total number of threat detections",
  labelNames: ["type"],
  registers: [register],
});

const activeUsers = new promClient.Gauge({
  name: "shadowhawk_active_users",
  help: "Number of active users",
  registers: [register],
});

const requestDuration = new promClient.Histogram({
  name: "shadowhawk_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const prometheusClient = {
  register,
  threatDetections,
  activeUsers,
  requestDuration,
};
