import express from 'express';
import { authenticateSession } from '../middleware/auth';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyEvents,
} from '../controllers/eventController';

const router = express.Router();

// All routes require authentication
router.use(authenticateSession);

// Event CRUD
router.post('/', createEvent); // Create event (coordinators)
router.get('/', getEvents); // Get all events
router.get('/my-events', getMyEvents); // Get user's registered/coordinating events
router.get('/:id', getEventById); // Get single event
router.put('/:id', updateEvent); // Update event (coordinator)
router.delete('/:id', deleteEvent); // Delete event (coordinator)

// Event registration
router.post('/:id/register', registerForEvent); // Register for event
router.delete('/:id/register', unregisterFromEvent); // Unregister from event

export default router;

