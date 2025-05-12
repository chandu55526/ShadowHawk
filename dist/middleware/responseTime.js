"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseTime = void 0;
const prom_client_1 = require("prom-client");
const logging_1 = __importDefault(require("../config/logging"));
const responseTimeHistogram = new prom_client_1.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 0.5, 1, 2, 5],
});
const responseTime = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = (Date.now() - start) / 1000; // Convert to seconds
        responseTimeHistogram
            .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
            .observe(duration);
        logging_1.default.debug("Response time:", {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration.toFixed(3)}s`,
        });
    });
    next();
};
exports.responseTime = responseTime;
//# sourceMappingURL=responseTime.js.map