import express from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth';
import * as newsletterController from '../controllers/newsletterController';

const router = express.Router();

// Public routes
router.post(
  '/subscribe',
  [
    body('email').isEmail().normalizeEmail().escape().withMessage('Please enter a valid email'),
    body('name').optional().trim().escape(),
    body('signupSource').optional().trim().escape(),
  ],
  newsletterController.subscribe
);
router.get('/confirm/:token', param('token').trim().notEmpty().escape(), newsletterController.confirmSubscription);
router.post(
  '/unsubscribe',
  [
    body('email').isEmail().normalizeEmail().escape().withMessage('Please enter a valid email'),
  ],
  newsletterController.unsubscribe
);

// Admin routes (require authentication)
router.get('/admin/subscribers', authenticate, newsletterController.getAllSubscribers);
router.get('/admin/subscribers/stats', authenticate, newsletterController.getSubscriberStats);
router.get('/admin/subscribers/export', authenticate, newsletterController.exportSubscribers);
router.put(
  '/admin/subscribers/:id',
  authenticate,
  [
    body('name').optional().trim().escape(),
    body('status').optional().isIn(['pending', 'confirmed', 'unsubscribed']).withMessage('Invalid status'),
  ],
  newsletterController.updateSubscriber
);
router.delete('/admin/subscribers/:id', authenticate, newsletterController.deleteSubscriber);
router.post('/admin/subscribers/bulk-delete', authenticate, newsletterController.bulkDeleteSubscribers);

export default router;
