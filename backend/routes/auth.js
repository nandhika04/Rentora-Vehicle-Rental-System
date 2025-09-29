const express = require('express');
const rateLimit = require('express-rate-limit');
const { authRateLimit } = require('../middleware/auth');
const { authenticate } = require('../middleware/auth');
const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    logout,
    refreshToken
} = require('../controllers/authController');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute (reduced for development)
    max: 10, // limit each IP to 10 requests per windowMs (increased for development)
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.post('/logout', authenticate, logout);

module.exports = router;
