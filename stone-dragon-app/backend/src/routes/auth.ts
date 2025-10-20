import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, logout, getProfile } from '../controllers/authController';
import { authenticateSession } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('role').isIn(['STUDENT', 'VOLUNTEER', 'COORDINATOR']).withMessage('Invalid role'),
  body('schoolId').optional().isUUID().withMessage('Invalid school ID'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/logout', authenticateSession, logout);
router.get('/profile', authenticateSession, getProfile);

export default router;
