import express, { Request, Response } from 'express';
import { getUserProfile, updateProfile } from '../controllers/user';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/profile/:username', (req: Request, res: Response) => getUserProfile(req, res));

// Protected routes (require authentication)
router.put('/profile', authenticate, (req: Request, res: Response) => updateProfile(req as any, res));

export default router; 