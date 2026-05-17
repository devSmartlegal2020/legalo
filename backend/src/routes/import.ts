import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { importRateLimiter } from '../middleware/rateLimit';
import {
  uploadWordPressImport,
  previewImport,
  getImportStatus,
  streamImportProgress,
  cancelImportController,
  undoImportController,
  getAllImportsController,
  getImportDetailsController,
} from '../controllers/importController';

const router = Router();

// Configure multer for memory storage (we'll process the file in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/xml' || file.originalname.endsWith('.xml')) {
      cb(null, true);
    } else {
      cb(new Error('Only XML files are allowed'));
    }
  },
});

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getAllImportsController);
router.get('/:id', getImportDetailsController);
router.get('/:id/status', getImportStatus);
router.get('/:id/progress', streamImportProgress);
router.post('/preview', importRateLimiter, upload.single('file'), previewImport);
router.post('/wordpress', importRateLimiter, upload.single('file'), uploadWordPressImport);
router.post('/:id/cancel', cancelImportController);
router.post('/:id/undo', undoImportController);

export default router;
