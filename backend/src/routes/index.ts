import { Router } from 'express';
import authRoutes from './auth';
import blogRoutes from './blogs';
import categoryRoutes from './categories';
import userRoutes from './users';
import uploadRoutes from './upload';
import importRoutes from './import';
import eventRoutes from './events';
import promotionRoutes from './promotions';
import ebookRoutes from './ebooks';
import newsletterRoutes from './newsletter';
import ctaRoutes from './ctas';
import settingsRoutes from './settings';

const router = Router();

router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/import', importRoutes);
router.use('/events', eventRoutes);
router.use('/promotions', promotionRoutes);
router.use('/ebooks', ebookRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/ctas', ctaRoutes);
router.use('/settings', settingsRoutes);

export default router;