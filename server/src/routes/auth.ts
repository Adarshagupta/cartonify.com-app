import express from 'express';
import { register, login, getCurrentUser } from '../controllers/auth';
import { authenticate } from '../middleware/auth';
import { asyncHandler, asyncAuthHandler } from '../utils/expressHelpers';

const router = express.Router();

// Register new user
router.post('/register', asyncHandler(register));

// Login user
router.post('/login', asyncHandler(login));

// Get current user (protected route)
router.get('/me', authenticate, asyncAuthHandler(getCurrentUser));

export default router; 