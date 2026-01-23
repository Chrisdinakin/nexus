import express from 'express';
import {
  getAllQualifications,
  getQualificationById,
  createQualification,
  updateQualification,
  deleteQualification
} from '../controllers/qualificationController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { cmsLimiter } from '../middleware/rateLimiter.js';
import { sanitizeBody } from '../middleware/sanitize.js';

const router = express.Router();

// Public routes
router.get('/', getAllQualifications);
router.get('/:id', getQualificationById);

// Protected routes (require authentication)
router.post('/', verifyToken, isAdmin, cmsLimiter, sanitizeBody, createQualification);
router.put('/:id', verifyToken, isAdmin, cmsLimiter, sanitizeBody, updateQualification);
router.delete('/:id', verifyToken, isAdmin, cmsLimiter, deleteQualification);

export default router;
