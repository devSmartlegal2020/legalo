import { Router } from 'express';
import { param } from 'express-validator';
import { uploadController } from '../controllers';
import { authenticate } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';
import { uploadRateLimiter } from '../middleware/rateLimit';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

// Upload image
router.post('/', uploadRateLimiter, uploadSingle, uploadController.uploadImage);

// Delete image
router.delete(
  '/:filename',
  uploadRateLimiter,
  param('filename').trim().notEmpty().escape(),
  uploadController.deleteImage
);

export default router;
