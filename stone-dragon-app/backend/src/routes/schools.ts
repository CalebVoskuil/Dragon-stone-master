/**
 *
 */

/**
 *
 */
import { Router } from 'express';
import { body } from 'express-validator';
import { 
  getSchools, 
  getSchoolById, 
  createSchool, 
  updateSchool, 
  deleteSchool 
} from '../controllers/schoolController';
import { authenticateSession, requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Validation rules
const createSchoolValidation = [
  body('name').trim().isLength({ min: 1 }).withMessage('School name is required'),
  body('address').optional().trim().isLength({ min: 1 }).withMessage('Address cannot be empty'),
  body('contactPhone').optional().trim().isLength({ min: 1 }).withMessage('Contact name cannot be empty'),
  body('contactEmail').optional().isEmail().normalizeEmail().withMessage('Invalid contact email'),
];

const updateSchoolValidation = [
  body('name').optional().trim().isLength({ min: 1 }).withMessage('School name cannot be empty'),
  body('address').optional().trim().isLength({ min: 1 }).withMessage('Address cannot be empty'),
  body('contactPhone').optional().trim().isLength({ min: 1 }).withMessage('Contact name cannot be empty'),
  body('contactEmail').optional().isEmail().normalizeEmail().withMessage('Invalid contact email'),
];

// Public routes (no authentication required)
router.get('/', getSchools);
router.get('/:id', getSchoolById);

// Protected routes (require authentication)
router.use(authenticateSession);

// Admin-only routes
router.post('/', requireAdmin, createSchoolValidation, validateRequest, createSchool);
router.put('/:id', requireAdmin, updateSchoolValidation, validateRequest, updateSchool);
router.delete('/:id', requireAdmin, deleteSchool);

export default router;
//----------------------------------------------------0_______________END OF FILE_______________0----------------------------------------------------//