"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMonitoring = exports.incrementThreatDetection = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
// Create a Registry to register metrics
const register = new prom_client_1.default.Registry();
// Create a counter for threat detections
const threatDetectionCounter = new prom_client_1.default.Counter({
    name: "threat_detection_total",
    help: "Total number of threat detections",
    registers: [register],
});
const incrementThreatDetection = () => {
    threatDetectionCounter.inc();
};
exports.incrementThreatDetection = incrementThreatDetection;
const setupMonitoring = (app) => {
    // Expose metrics endpoint
    app.get("/metrics", async (_, res) => {
        res.set("Content-Type", register.contentType);
        res.end(await register.metrics());
    });
};
exports.setupMonitoring = setupMonitoring;
//# sourceMappingURL=monitoring.js.map