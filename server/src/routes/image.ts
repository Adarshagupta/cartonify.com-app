import express from 'express';
import { createImage, getAllImages, getImageById, deleteImage } from '../controllers/image';
import { authenticate } from '../middleware/auth';
import { asyncHandler, asyncAuthHandler } from '../utils/expressHelpers';

const router = express.Router();

// Public routes
router.get('/', asyncHandler(getAllImages));
router.get('/:id', asyncHandler(getImageById));

// Protected routes (require authentication)
router.post('/', authenticate, asyncAuthHandler(createImage));
router.delete('/:id', authenticate, asyncAuthHandler(deleteImage));

export default router; 