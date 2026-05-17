import { Router } from 'express';
import { body, param } from 'express-validator';
import { categoryController } from '../controllers';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/public', categoryController.getAllCategories);

// Protected routes (require authentication)
router.get('/', authenticate, categoryController.getAllCategoriesAdmin);

router.get(
  '/slug/:slug',
  param('slug').trim().notEmpty().escape(),
  categoryController.getCategoryBySlug
);

// Create category (Admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').trim().notEmpty().escape().withMessage('Category name is required'),
    body('description').optional().trim().escape(),
  ],
  categoryController.createCategory
);

// Update category (Admin only)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    param('id').isMongoId(),
    body('name').optional().trim().escape(),
    body('description').optional().trim().escape(),
    body('isActive').optional().isBoolean(),
  ],
  categoryController.updateCategory
);

// Delete category (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  param('id').isMongoId(),
  categoryController.deleteCategory
);

// Get category stats
router.get('/stats/all', authenticate, categoryController.getCategoryStats);

export default router;
