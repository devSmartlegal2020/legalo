import express from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth';
import * as consultationController from '../controllers/consultationController';

const router = express.Router();

// Public routes
router.post(
  '/',
  [
    body('fullName').trim().notEmpty().escape().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().escape().withMessage('Please enter a valid email'),
    body('phone').trim().notEmpty().escape().withMessage('Phone number is required'),
    body('serviceType').trim().notEmpty().escape().withMessage('Service type is required'),
    body('message').optional().trim().escape(),
  ],
  consultationController.createConsultation
);

// Admin routes (require authentication)
router.get('/', authenticate, consultationController.getAllConsultations);

router.patch(
  '/:id/status',
  authenticate,
  [
    param('id').isMongoId().withMessage('Invalid consultation ID'),
    body('status')
      .isIn(['pending', 'contacted', 'completed'])
      .withMessage('Invalid status value'),
  ],
  consultationController.updateConsultationStatus
);

router.delete(
  '/:id',
  authenticate,
  [param('id').isMongoId().withMessage('Invalid consultation ID')],
  consultationController.deleteConsultation
);

export default router;
