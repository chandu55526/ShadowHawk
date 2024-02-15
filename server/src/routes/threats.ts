import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

export const setupThreatRoutes = (app: any, db: any) => {
  const router = Router();

  // Get all threats
  router.get('/', authMiddleware, (req: Request, res: Response) => {
    res.json(db.threats);
  });

  // Get threat by ID
  router.get('/:id', authMiddleware, (req: Request, res: Response) => {
    const threat = db.threats.find((t: any) => t.id === req.params.id);
    if (!threat) {
      return res.status(404).json({ message: 'Threat not found' });
    }
    res.json(threat);
  });

  // Update threat status
  router.put('/:id', authMiddleware, (req: Request, res: Response) => {
    const threat = db.threats.find((t: any) => t.id === req.params.id);
    if (!threat) {
      return res.status(404).json({ message: 'Threat not found' });
    }
    threat.status = req.body.status;
    res.json(threat);
  });

  app.use('/api/threats', router);
}; 