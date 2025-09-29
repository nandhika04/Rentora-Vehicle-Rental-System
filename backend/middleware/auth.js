const { verifyToken, extractToken } = require('../utils/jwt');
const User = require('../models/user.model');

// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        const token = extractToken(req);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = verifyToken(token);
        
        // Get user from database
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated.'
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token.',
            error: error.message
        });
    }
};

// Admin authorization middleware
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const token = extractToken(req);
        
        if (token) {
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.id).select('-password');
            
            if (user && user.isActive) {
                req.user = user;
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};

// Rate limiting for auth endpoints
const authRateLimit = (req, res, next) => {
    // Simple in-memory rate limiting (in production, use Redis)
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5;

    if (!global.authAttempts) {
        global.authAttempts = new Map();
    }

    const attempts = global.authAttempts.get(clientId) || { count: 0, resetTime: now + windowMs };
    
    if (now > attempts.resetTime) {
        attempts.count = 0;
        attempts.resetTime = now + windowMs;
    }

    if (attempts.count >= maxAttempts) {
        return res.status(429).json({
            success: false,
            message: 'Too many authentication attempts. Please try again later.',
            retryAfter: Math.ceil((attempts.resetTime - now) / 1000)
        });
    }

    attempts.count++;
    global.authAttempts.set(clientId, attempts);
    next();
};

module.exports = {
    authenticate,
    authorizeAdmin,
    optionalAuth,
    authRateLimit
};
