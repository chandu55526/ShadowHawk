"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const auth_1 = require("./auth");
const threats_1 = __importDefault(require("./threats"));
const setupRoutes = (app) => {
    (0, auth_1.setupAuthRoutes)(app);
    app.use("/api/threats", threats_1.default);
};
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=index.js.map