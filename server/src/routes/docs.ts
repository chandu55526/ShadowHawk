import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const router = express.Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShadowHawk API Documentation',
      version: '1.0.0',
      description: 'API documentation for ShadowHawk Security Platform',
      contact: {
        name: 'API Support',
        email: 'support@shadowhawk.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.ts']
};

const specs = swaggerJsdoc(options);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ShadowHawk API Documentation'
}));

export default router;
