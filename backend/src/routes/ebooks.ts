import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { uploadEbook, processUploadedImage } from '../middleware/upload';
import * as ebookController from '../controllers/ebookController';
import multer from 'multer';

const router = express.Router();

// Multer error handler middleware
const handleMulterError = (err: any, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 20MB.',
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  } else if (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }
  next();
};

// Public routes
router.get('/public/ebooks', ebookController.getPublishedEbooks);
router.get('/public/ebooks/:slug', ebookController.getEbookBySlug);
router.post(
  '/public/ebooks/:id/download',
  [
    body('email').isEmail().normalizeEmail().escape().withMessage('Please enter a valid email'),
    body('name').optional().trim().escape(),
    body('company').optional().trim().escape(),
    body('consent').isBoolean().withMessage('Consent must be a boolean'),
  ],
  ebookController.recordDownload
);

// Admin routes (require authentication)
router.get('/admin/ebooks', authenticate, ebookController.getAllEbooks);
router.get('/admin/ebooks/:id', authenticate, ebookController.getEbookById);
router.get('/admin/ebooks/:id/stats', authenticate, ebookController.getEbookStats);
router.post(
  '/admin/ebooks',
  authenticate,
  uploadEbook.single('file'),
  handleMulterError,
  processUploadedImage,
  ebookController.createEbook
);
router.put(
  '/admin/ebooks/:id',
  authenticate,
  uploadEbook.single('file'),
  handleMulterError,
  processUploadedImage,
  ebookController.updateEbook
);
router.delete('/admin/ebooks/:id', authenticate, ebookController.deleteEbook);
router.post('/admin/ebooks/bulk-delete', authenticate, ebookController.bulkDeleteEbooks);
router.get('/admin/downloads', authenticate, ebookController.getAllDownloads);

export default router;
