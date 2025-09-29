const jwt = require('jsonwebtoken');

// JWT Secret - In production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

// Generate JWT token
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'rentora-app',
        audience: 'rentora-users'
    });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: 'rentora-app',
        audience: 'rentora-users'
    });
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET, {
            issuer: 'rentora-app',
            audience: 'rentora-users'
        });
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

// Generate token pair (access + refresh)
const generateTokenPair = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
    };

    return {
        accessToken: generateToken(payload),
        refreshToken: generateRefreshToken({ id: user._id }),
        expiresIn: JWT_EXPIRES_IN
    };
};

// Extract token from request headers
const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return null;
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    generateTokenPair,
    extractToken,
    JWT_SECRET,
    JWT_EXPIRES_IN
};
