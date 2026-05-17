import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import * as ctaController from '../controllers/ctaController';

const router = Router();

// Public routes
router.get('/active', ctaController.getActiveCTAs);

// Protected admin routes
router.use(authenticate);

router.get('/', ctaController.getAllCTAs);
router.get('/:id', ctaController.getCTAById);
router.post('/', authorize('admin', 'editor'), ctaController.createCTA);
router.put('/:id', authorize('admin', 'editor'), ctaController.updateCTA);
router.delete('/:id', authorize('admin', 'editor'), ctaController.deleteCTA);
router.patch('/:id/toggle-status', authorize('admin', 'editor'), ctaController.toggleCTAStatus);

export default router;
