"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const health_1 = __importDefault(require("./health"));
const docs_1 = __importDefault(require("./docs"));
const admin_1 = __importDefault(require("./admin"));
const webhooks_1 = __importDefault(require("./webhooks"));
const setupRoutes = (app) => {
    app.use("/api/health", health_1.default);
    app.use("/api/docs", docs_1.default);
    app.use("/api/admin", admin_1.default);
    app.use("/api/webhooks", webhooks_1.default);
};
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=index.js.map