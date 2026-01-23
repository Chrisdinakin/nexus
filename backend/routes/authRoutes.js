import express from 'express';
import { login, verifyToken, logout } from '../controllers/authController.js';
import { verifyToken as verifyTokenMiddleware } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { sanitizeBody } from '../middleware/sanitize.js';

const router = express.Router();

// Login route with rate limiting and input sanitization
router.post('/login', authLimiter, sanitizeBody, login);

// Verify token route
router.get('/verify', verifyTokenMiddleware, verifyToken);

// Logout route
router.post('/logout', verifyTokenMiddleware, logout);

export default router;
