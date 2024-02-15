import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

export const setupSettingsRoutes = (app: any, db: any) => {
  const router = Router();

  // Get settings
  router.get('/', authMiddleware, (req: Request, res: Response) => {
    res.json(db.settings);
  });

  // Update settings
  router.put('/', authMiddleware, (req: Request, res: Response) => {
    db.settings = { ...db.settings, ...req.body };
    res.json(db.settings);
  });

  app.use('/api/settings', router);
}; 