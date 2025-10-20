import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { authenticateSession, requireAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateSession);

// Routes
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', requireAdmin, deleteUser);

export default router;
