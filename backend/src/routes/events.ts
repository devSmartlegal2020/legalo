import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllEvents,
  getPublishedEvents,
  getEventBySlug,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getFeaturedEvents,
  getUpcomingEvents,
  getRelatedEvents,
  getScheduleEvents,
} from '../controllers/eventController';
import { authenticate, authorize } from '../middleware/auth';
import { upload, processUploadedImage } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/public/events', getPublishedEvents);
router.get('/public/events/featured', getFeaturedEvents);
router.get('/public/events/upcoming', getUpcomingEvents);
router.get('/public/events/schedule', getScheduleEvents);
router.get('/public/events/:slug', getEventBySlug);
router.get('/public/events/:slug/related', getRelatedEvents);

// Admin routes
router.get('/admin/events', authenticate, authorize('admin'), getAllEvents);
router.get('/admin/events/:id', authenticate, authorize('admin'), getEventById);

router.post(
  '/admin/events',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  processUploadedImage,
  [
    body('title').notEmpty().escape().withMessage('Title is required'),
    body('description').notEmpty().escape().withMessage('Description is required'),
    body('fullDescription').notEmpty().withMessage('Full description is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('duration').notEmpty().withMessage('Duration is required'),
    body('location').notEmpty().escape().withMessage('Location is required'),
    body('type').isIn(['Webinar', 'Workshop', 'Networking', 'Clinic']).withMessage('Invalid event type'),
    body('category').notEmpty().escape().withMessage('Category is required'),
    body('status').isIn(['draft', 'published']).withMessage('Invalid status'),
    body('registrationLink').optional().trim().isURL().withMessage('Registration link must be a valid URL').escape(),
  ],
  createEvent
);

router.put(
  '/admin/events/:id',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  processUploadedImage,
  [
    body('title').optional().notEmpty().escape().withMessage('Title cannot be empty'),
    body('type').optional().isIn(['Webinar', 'Workshop', 'Networking', 'Clinic']).withMessage('Invalid event type'),
    body('status').optional().isIn(['draft', 'published']).withMessage('Invalid status'),
    body('registrationLink').optional().trim().isURL().withMessage('Registration link must be a valid URL').escape(),
  ],
  updateEvent
);

router.delete('/admin/events/:id', authenticate, authorize('admin'), deleteEvent);

export default router;
