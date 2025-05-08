const express = require('express');
const { getUserProfile, updateProfile } = require('../controllers/user');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/profile/:username', (req, res) => getUserProfile(req, res));

// Protected routes (require authentication)
router.put('/profile', authenticate, (req, res) => updateProfile(req, res));

module.exports = router; 