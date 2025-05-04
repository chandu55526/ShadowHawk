import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { setupLogging } from './utils/logger';
import { setupRoutes } from './routes';
import { setupSwagger } from './config/swagger';

export const createServer = () => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Setup logging
  setupLogging(app);

  // Routes
  setupRoutes(app);

  // Swagger documentation
  setupSwagger(app);

  // Error handling
  app.use(errorHandler);

  return app;
};

export default createServer;
