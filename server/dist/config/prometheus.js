"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prometheusClient = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
// Create a Registry to register metrics
const register = new prom_client_1.default.Registry();
// Add default metrics
prom_client_1.default.collectDefaultMetrics({
    register,
    prefix: "shadowhawk_",
});
// Custom metrics
const threatDetections = new prom_client_1.default.Counter({
    name: "shadowhawk_threat_detections_total",
    help: "Total number of threat detections",
    labelNames: ["type"],
    registers: [register],
});
const activeUsers = new prom_client_1.default.Gauge({
    name: "shadowhawk_active_users",
    help: "Number of active users",
    registers: [register],
});
const requestDuration = new prom_client_1.default.Histogram({
    name: "shadowhawk_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    registers: [register],
});
exports.prometheusClient = {
    register,
    threatDetections,
    activeUsers,
    requestDuration,
};
//# sourceMappingURL=prometheus.js.map