import { sanitizeInput } from '../utils/validation.js';

/**
 * Middleware to sanitize request body
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  next();
};

/**
 * Middleware to sanitize query parameters
 */
export const sanitizeQuery = (req, res, next) => {
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  next();
};

/**
 * Middleware to sanitize all inputs
 */
export const sanitizeAll = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  if (req.params) {
    req.params = sanitizeInput(req.params);
  }
  next();
};
