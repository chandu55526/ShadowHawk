"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const routes_1 = require("./routes");
const swagger_1 = require("./config/swagger");
const createServer = () => {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Setup logging
    (0, logger_1.setupLogging)(app);
    // Routes
    (0, routes_1.setupRoutes)(app);
    // Swagger documentation
    (0, swagger_1.setupSwagger)(app);
    // Error handling
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.createServer = createServer;
exports.default = exports.createServer;
//# sourceMappingURL=server.js.map