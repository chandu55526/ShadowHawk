"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMonitoring = void 0;
const prom_client_1 = require("prom-client");
const response_time_1 = __importDefault(require("response-time"));
const logging_1 = __importDefault(require("./logging"));
// Initialize metrics
const httpRequestsTotal = new prom_client_1.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"],
});
const httpRequestDurationSeconds = new prom_client_1.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status"],
});
const setupMonitoring = (app) => {
    // Record metrics for each request
    app.use((0, response_time_1.default)((req, res, time) => {
        const route = req.route?.path || req.path;
        const method = req.method;
        const status = res.statusCode;
        try {
            httpRequestsTotal.inc({
                method,
                route,
                status: status.toString(),
            });
            httpRequestDurationSeconds.observe({
                method,
                route,
                status: status.toString(),
            }, time / 1000);
        }
        catch (error) {
            logging_1.default.error("Error recording metrics:", error);
        }
    }));
    // Expose metrics endpoint
    app.get("/metrics", async (req, res) => {
        try {
            res.set("Content-Type", prom_client_1.register.contentType);
            res.end(await prom_client_1.register.metrics());
        }
        catch (error) {
            logging_1.default.error("Error serving metrics:", error);
            res.status(500).end();
        }
    });
};
exports.setupMonitoring = setupMonitoring;
//# sourceMappingURL=monitoring.js.map