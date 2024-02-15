import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupThreatDetection } from './threatDetection';
import { setupAuthRoutes } from './routes/auth';
import { setupThreatRoutes } from './routes/threats';
import { setupUserRoutes } from './routes/users';
import { setupDashboardRoutes } from './routes/dashboard';
import { setupSettingsRoutes } from './routes/settings';
import { setupLogging } from './utils/logger';

// In-memory storage
const inMemoryDB = {
  users: [],
  threats: [],
  settings: {}
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Setup routes
setupAuthRoutes(app, inMemoryDB);
setupThreatRoutes(app, inMemoryDB);
setupUserRoutes(app, inMemoryDB);
setupDashboardRoutes(app, inMemoryDB);
setupSettingsRoutes(app, inMemoryDB);

// Setup threat detection
setupThreatDetection(io, inMemoryDB);

// Setup logging
setupLogging(app);

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 