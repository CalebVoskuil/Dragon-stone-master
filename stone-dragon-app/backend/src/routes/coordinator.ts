import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getPendingLogs, 
  reviewVolunteerLog, 
  getCoordinatorDashboard,
  getSchoolStats,
  getStudentsList,
  getLeaderboard
} from '../controllers/coordinatorController';
import { authenticateSession, requireCoordinator } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Validation rules
const reviewValidation = [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('coordinatorComment').optional().trim().isLength({ max: 500 }).withMessage('Comment too long'),
];

// Routes - Note: authenticateSession and requireCoordinator moved to individual routes
router.get('/dashboard', authenticateSession, requireCoordinator, getCoordinatorDashboard);
router.get('/pending-logs', authenticateSession, requireCoordinator, getPendingLogs);
router.get('/school-stats', authenticateSession, requireCoordinator, getSchoolStats);
router.get('/students', authenticateSession, requireCoordinator, getStudentsList);
router.get('/leaderboard', authenticateSession, requireCoordinator, getLeaderboard);
router.put('/review/:logId', authenticateSession, requireCoordinator, reviewValidation, validateRequest, reviewVolunteerLog);

export default router;
