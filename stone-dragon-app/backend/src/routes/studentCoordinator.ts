/**
 *
 */

/**
 *
 */
import express from 'express';
import { authenticateSession } from '../middleware/auth';
import {
  getAssignedEvents,
  getPendingEventClaims,
  reviewEventClaim,
} from '../controllers/studentCoordinatorController';

const router = express.Router();

// All routes require authentication
router.use(authenticateSession);

// Student coordinator routes
router.get('/assigned-events', getAssignedEvents); // Get events where user is student coordinator
router.get('/event-claims', getPendingEventClaims); // Get pending event claims for assigned events
router.put('/review-claim/:id', reviewEventClaim); // Review event claim (approve/reject)

export default router;
//----------------------------------------------------0_______________END OF FILE_______________0----------------------------------------------------//
