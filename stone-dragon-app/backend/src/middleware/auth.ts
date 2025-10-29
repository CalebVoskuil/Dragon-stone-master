/**
 * @fileoverview Authentication middleware for Stone Dragon Volunteer Hours App.
 * Provides session-based authentication and role-based access control.
 * 
 * @module middleware/auth
 * @requires express
 * @requires @prisma/client
 */

import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

/**
 * Middleware to authenticate user session.
 * Verifies that a valid session exists and retrieves the user from the database.
 * 
 * @param {AuthenticatedRequest} req - Express request object with session data
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 * 
 * @throws {401} Authentication required - No user ID in session
 * @throws {401} Invalid or inactive user - User not found or inactive
 * @throws {500} Authentication error - Server error during authentication
 */
export const authenticateSession = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Auth check - Session ID:', req.sessionID);
    console.log('Auth check - Session data:', req.session);
    const userId = (req.session as any).userId;
    console.log('Auth check - User ID:', userId);

    if (!userId) {
      console.log('Auth failed - No user ID in session');
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        schoolId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid or inactive user',
      });
      return;
    }

    req.user = user as any;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

/**
 * Higher-order middleware function to require specific user roles.
 * Creates a middleware that checks if the authenticated user has one of the required roles.
 * 
 * @param {string[]} roles - Array of allowed role names (e.g., ['COORDINATOR', 'ADMIN'])
 * @returns {Function} Express middleware function for role checking
 * 
 * @example
 * router.get('/admin-only', requireRole(['ADMIN']), adminController);
 * 
 * @throws {401} Authentication required - User not authenticated
 * @throws {403} Insufficient permissions - User role not in allowed roles
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to require COORDINATOR or ADMIN role.
 * Convenience middleware for routes that need coordinator-level access.
 * 
 * @constant
 * @type {Function}
 */
export const requireCoordinator = requireRole(['COORDINATOR', 'ADMIN']);

/**
 * Middleware to require ADMIN role.
 * Convenience middleware for routes that need admin-only access.
 * 
 * @constant
 * @type {Function}
 */
export const requireAdmin = requireRole(['ADMIN']);

/* End of file middleware/auth.ts */
