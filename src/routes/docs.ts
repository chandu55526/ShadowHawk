import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const router = Router();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShadowHawk API Documentation",
      version: "1.0.0",
      description: "API documentation for the ShadowHawk threat detection system",
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:5001",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(specs));

export default router; 