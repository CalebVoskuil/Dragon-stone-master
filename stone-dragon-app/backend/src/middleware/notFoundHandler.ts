/**
 * @fileoverview 404 Not Found handler middleware.
 * Handles requests to undefined routes.
 * 
 * @module middleware/notFoundHandler
 * @requires express
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle 404 Not Found errors.
 * This should be placed after all route definitions to catch undefined routes.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} _next - Express next middleware function (unused)
 * @returns {void}
 * 
 * @example
 * // In server.ts, after all routes
 * app.use(notFoundHandler);
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: 'Not Found',
  });
};

/* End of file middleware/notFoundHandler.ts */
