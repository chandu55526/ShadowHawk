import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

export const setupUserRoutes = (app: any, db: any) => {
  const router = Router();

  // Get user profile
  router.get('/profile', authMiddleware, (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = db.users.find((u: any) => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't send password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.use('/api/users', router);
}; 