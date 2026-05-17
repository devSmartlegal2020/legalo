import { Router } from 'express';
import { body, param } from 'express-validator';
import { blogController } from '../controllers';
import { authenticate } from '../middleware/auth';
import { keywordRecommendationLimiter } from '../middleware/rateLimit';
import { uploadSingle, processUploadedImage } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/public', blogController.getPublishedBlogs);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/popular', blogController.getPopularBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);

// Protected routes (require authentication)
router.get('/', authenticate, blogController.getAllBlogs);
router.get('/:id', authenticate, param('id').isMongoId(), blogController.getBlogById);

// Create blog
router.post(
  '/',
  authenticate,
  uploadSingle,
  processUploadedImage,
  [
    body('title').trim().notEmpty().escape().withMessage('Title is required'),
    body('excerpt').trim().notEmpty().escape().withMessage('Excerpt is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category').isMongoId().withMessage('Valid category ID is required'),
    body('status').isIn(['draft', 'published', 'scheduled']).withMessage('Status must be draft, published, or scheduled'),
    body('canonicalUrl').optional({ checkFalsy: true }).trim().isURL().withMessage('Canonical URL must be valid').escape(),
  ],
  blogController.createBlog
);

// Update blog
router.put(
  '/:id',
  authenticate,
  uploadSingle,
  processUploadedImage,
  [
    param('id').isMongoId(),
    body('title').optional().trim().escape(),
    body('excerpt').optional().trim().escape(),
    body('canonicalUrl').optional().trim().isURL().withMessage('Canonical URL must be valid').escape(),
    body('category').optional().isMongoId(),
    body('status').optional().isIn(['draft', 'published', 'scheduled']),
    body('canonicalUrl').optional({ checkFalsy: true }).trim().isURL().withMessage('Canonical URL must be valid').escape(),
  ],
  blogController.updateBlog
);

// Delete blog
router.delete(
  '/:id',
  authenticate,
  param('id').isMongoId(),
  blogController.deleteBlog
);

// Bulk operations
router.post(
  '/bulk-delete',
  authenticate,
  [
    body('ids').isArray({ min: 1 }).withMessage('IDs array is required and must not be empty'),
    body('ids.*').isMongoId().withMessage('Each ID must be a valid MongoDB ObjectId'),
  ],
  blogController.bulkDeleteBlogs
);

router.post(
  '/bulk-archive',
  authenticate,
  [
    body('ids').isArray({ min: 1 }).withMessage('IDs array is required and must not be empty'),
    body('ids.*').isMongoId().withMessage('Each ID must be a valid MongoDB ObjectId'),
  ],
  blogController.bulkArchiveBlogs
);

// Keyword recommendations
router.post(
  '/recommend-keywords',
  authenticate,
  keywordRecommendationLimiter,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('country').optional().isLength({ min: 2, max: 2 }).withMessage('Country code must be 2 characters'),
    body('maxKeywords').optional().isInt({ min: 1, max: 20 }).withMessage('Max keywords must be between 1 and 20'),
  ],
  blogController.recommendKeywords
);

export default router;
