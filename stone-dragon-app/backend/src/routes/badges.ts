import { Router } from 'express';
import { getBadges, getUserBadges, getBadgeProgress } from '../controllers/badgeController';
import { authenticateSession } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateSession);

// Routes
router.get('/', getBadges);
router.get('/user/:userId', getUserBadges);
router.get('/progress/:userId', getBadgeProgress);

export default router;
