/**
 *
 */

/**
 *
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { 
  createVolunteerLog, 
  getVolunteerLogs, 
  getVolunteerLogById, 
  updateVolunteerLog,
  deleteVolunteerLog,
  getVolunteerLogProofUrl,
} from '../controllers/volunteerLogController';
import { authenticateSession } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { upload } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticateSession);

// Validation rules
const createLogValidation = [
  body('hours').isFloat({ min: 0.1 }).withMessage('Hours must be a positive number'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('schoolId').isString().withMessage('Valid school ID is required'),
];

const updateLogValidation = [
  body('hours').optional().isFloat({ min: 0.1 }).withMessage('Hours must be a positive number'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
];

// Routes
router.post('/', upload.single('proofFile'), createLogValidation, validateRequest, createVolunteerLog);
router.get('/', getVolunteerLogs);
router.get('/:id', getVolunteerLogById);
router.get('/:id/proof-url', getVolunteerLogProofUrl);
router.put('/:id', updateLogValidation, validateRequest, updateVolunteerLog);
router.delete('/:id', deleteVolunteerLog);

export default router;
//----------------------------------------------------0_______________END OF FILE_______________0----------------------------------------------------//