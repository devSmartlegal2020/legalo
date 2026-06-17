import express from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth';
import * as eventRegistrationController from '../controllers/eventRegistrationController';

const router = express.Router();

// Public route to register for an event by slug
router.post(
  '/public/events/:slug/register',
  [
    param('slug').trim().notEmpty().escape().withMessage('Event slug is required'),
    body('name').trim().notEmpty().escape().withMessage('Attendee name is required'),
    body('email').isEmail().normalizeEmail().escape().withMessage('Please enter a valid email address'),
    body('phone').optional().trim().escape(),
    body('company').optional().trim().escape(),
    body('message').optional().trim().escape(),
  ],
  eventRegistrationController.registerForEvent
);

// Admin route to list registrations
router.get(
  '/admin/registrations',
  authenticate,
  eventRegistrationController.getAllRegistrations
);

// Admin route to delete a registration
router.delete(
  '/admin/registrations/:id',
  authenticate,
  [param('id').isMongoId().withMessage('Invalid registration ID')],
  eventRegistrationController.deleteRegistration
);

export default router;
