import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getPendingLogs, 
  reviewVolunteerLog, 
  getCoordinatorDashboard,
  getSchoolStats 
} from '../controllers/coordinatorController';
import { authenticateToken, requireCoordinator } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// All routes require coordinator authentication
router.use(authenticateToken);
router.use(requireCoordinator);

// Validation rules
const reviewValidation = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('coordinatorComment').optional().trim().isLength({ max: 500 }).withMessage('Comment too long'),
];

// Routes
router.get('/dashboard', getCoordinatorDashboard);
router.get('/pending-logs', getPendingLogs);
router.get('/school-stats', getSchoolStats);
router.put('/review/:logId', reviewValidation, validateRequest, reviewVolunteerLog);

export default router;
