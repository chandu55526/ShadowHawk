import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

export const setupDashboardRoutes = (app: any, db: any) => {
  const router = Router();

  // Get dashboard stats
  router.get('/stats', authMiddleware, (req: Request, res: Response) => {
    const stats = {
      totalThreats: db.threats.length,
      activeThreats: db.threats.filter((t: any) => t.status === 'detected').length,
      resolvedThreats: db.threats.filter((t: any) => t.status === 'resolved').length,
      threatTypes: db.threats.reduce((acc: any, threat: any) => {
        acc[threat.type] = (acc[threat.type] || 0) + 1;
        return acc;
      }, {})
    };
    res.json(stats);
  });

  app.use('/api/dashboard', router);
}; 