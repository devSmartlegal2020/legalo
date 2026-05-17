import { Router } from 'express';
import { body, param } from 'express-validator';
import { userController } from '../controllers';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All user routes are protected and require admin access
router.use(authenticate);
router.use(authorize('admin'));

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', param('id').isMongoId(), userController.getUserById);

// Create user
router.post(
  '/',
  [
    body('email').isEmail().normalizeEmail().escape().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').trim().notEmpty().escape().withMessage('Name is required'),
    body('role').optional().isIn(['admin', 'editor']).withMessage('Role must be admin or editor'),
  ],
  userController.createUser
);

// Update user
router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('name').optional().trim().escape(),
    body('email').optional().isEmail().normalizeEmail().escape(),
    body('role').optional().isIn(['admin', 'editor']),
    body('isActive').optional().isBoolean(),
  ],
  userController.updateUser
);

// Delete user
router.delete('/:id', param('id').isMongoId(), userController.deleteUser);

// Toggle user status
router.patch('/:id/toggle-status', param('id').isMongoId(), userController.toggleUserStatus);

// Change password
router.put(
  '/:id/password',
  [
    param('id').isMongoId(),
    body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  userController.changePassword
);

export default router;
