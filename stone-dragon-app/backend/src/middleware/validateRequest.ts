/**
 * @fileoverview Request validation middleware using express-validator.
 * Validates incoming request data against defined validation rules.
 * 
 * @module middleware/validateRequest
 * @requires express
 * @requires express-validator
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Middleware to validate request data.
 * Checks validation results from express-validator and returns errors if any.
 * Should be used after validation chain definitions.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {void}
 * 
 * @example
 * router.post('/user',
 *   body('email').isEmail(),
 *   body('name').notEmpty(),
 *   validateRequest,
 *   userController
 * );
 * 
 * @throws {400} Validation failed - Returns array of validation errors
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }
  
  next();
};

/* End of file middleware/validateRequest.ts */
