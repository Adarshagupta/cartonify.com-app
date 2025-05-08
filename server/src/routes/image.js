const express = require('express');
const { createImage, getAllImages, getImageById, deleteImage } = require('../controllers/image');
const { authenticate } = require('../middleware/auth');
const { asyncHandler, asyncAuthHandler } = require('../utils/expressHelpers');

const router = express.Router();

// Public routes
router.get('/', asyncHandler(getAllImages));
router.get('/:id', asyncHandler(getImageById));

// Protected routes (require authentication)
router.post('/', authenticate, asyncAuthHandler(createImage));
router.delete('/:id', authenticate, asyncAuthHandler(deleteImage));

module.exports = router; 