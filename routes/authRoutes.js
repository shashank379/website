const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (add auth middleware when needed)
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
