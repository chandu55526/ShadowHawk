import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express, Request, Response } from "express";

const options: swaggerJsdoc.Options = {
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

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  // Swagger documentation endpoint
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Endpoint to get swagger.json
  app.get("/swagger.json", (_: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
