import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token
 */
export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Middleware to check if user is admin
 * NOTE: Currently checks if user is authenticated. 
 * TODO: Add role-based access control by:
 * 1. Adding a 'role' column to users table
 * 2. Checking req.user.role === 'admin'
 * 3. Implementing proper RBAC for different permission levels
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }
  // Currently, all authenticated users are considered admins
  // In a multi-user system, add proper role checking here
  next();
};
