import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllPromotions,
  getActivePromotions,
  getPromotionBySlug,
  getPromotionById,
  getPopupPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../controllers/promotionController';
import { authenticate, authorize } from '../middleware/auth';
import { upload, processUploadedImage } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/public/promotions', getActivePromotions);
router.get('/public/promotions/popup', getPopupPromotion);
router.get('/public/promotions/:slug', getPromotionBySlug);

// Admin routes
router.get('/admin/promotions', authenticate, authorize('admin'), getAllPromotions);
router.get('/admin/promotions/:id', authenticate, authorize('admin'), getPromotionById);

router.post(
  '/admin/promotions',
  authenticate,
  authorize('admin'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
  ]),
  processUploadedImage,
  [
    body('title').notEmpty().escape().withMessage('Title is required'),
    body('description').notEmpty().escape().withMessage('Description is required'),
    body('status').isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
    body('ctaLink').optional().trim().isURL().withMessage('CTA link must be a valid URL').escape(),
  ],
  createPromotion
);

router.put(
  '/admin/promotions/:id',
  authenticate,
  authorize('admin'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
  ]),
  processUploadedImage,
  [
    body('title').optional().notEmpty().escape().withMessage('Title cannot be empty'),
    body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
    body('ctaLink').optional().trim().isURL().withMessage('CTA link must be a valid URL').escape(),
  ],
  updatePromotion
);

router.delete('/admin/promotions/:id', authenticate, authorize('admin'), deletePromotion);

export default router;
