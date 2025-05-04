"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "ShadowHawk API",
            version: "1.0.0",
            description: "API documentation for ShadowHawk threat detection system",
        },
        servers: [
            {
                url: "http://localhost:5001",
                description: "Development server",
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    // Swagger documentation endpoint
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec));
    // Endpoint to get swagger.json
    app.get("/swagger.json", (_, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(exports.swaggerSpec);
    });
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map