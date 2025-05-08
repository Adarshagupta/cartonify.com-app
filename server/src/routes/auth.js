const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/auth');
const { authenticate } = require('../middleware/auth');
const { asyncHandler, asyncAuthHandler } = require('../utils/expressHelpers');

const router = express.Router();

// Register new user
router.post('/register', asyncHandler(register));

// Login user
router.post('/login', asyncHandler(login));

// Get current user (protected route)
router.get('/me', authenticate, asyncAuthHandler(getCurrentUser));

module.exports = router; 