import express from 'express';
import {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { cmsLimiter } from '../middleware/rateLimiter.js';
import { sanitizeBody } from '../middleware/sanitize.js';

const router = express.Router();

// Public routes
router.get('/', getAllProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:id', getProjectById);

// Protected routes (require authentication)
router.post('/', verifyToken, isAdmin, cmsLimiter, sanitizeBody, createProject);
router.put('/:id', verifyToken, isAdmin, cmsLimiter, sanitizeBody, updateProject);
router.delete('/:id', verifyToken, isAdmin, cmsLimiter, deleteProject);

export default router;
