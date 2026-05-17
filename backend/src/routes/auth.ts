import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers';
import { authenticate } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimit';

const router = Router();

// Register
router.post(
  '/register',
  authRateLimiter,
  [
    body('email').isEmail().normalizeEmail().escape().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).escape().withMessage('Password must be at least 8 characters'),
    body('name').trim().notEmpty().escape().withMessage('Name is required'),
  ],
  authController.register
);

// Login
router.post(
  '/login',
  authRateLimiter,
  [
    body('email').isEmail().normalizeEmail().escape().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

// Logout
router.post('/logout', authenticate, authController.logout);

// Get current user
router.get('/me', authenticate, authController.getMe);

// Update profile
router.put(
  '/profile',
  authenticate,
  [
    body('name').optional().trim().escape(),
    body('avatar').optional().trim().isURL().withMessage('Avatar must be a valid URL').escape(),
  ],
  authController.updateProfile
);

export default router;
