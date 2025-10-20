import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError, PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { AppError } from '../types';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'A record with this information already exists';
        isOperational = true;
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        isOperational = true;
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid reference to related record';
        isOperational = true;
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
        isOperational = true;
    }
  } else if (error instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
    isOperational = true;
  } else if (error instanceof PrismaClientInitializationError) {
    statusCode = 500;
    message = 'Database connection failed';
    isOperational = true;
  }
  // Handle custom AppError
  else if (error instanceof Error && 'statusCode' in error) {
    const appError = error as AppError;
    statusCode = appError.statusCode;
    message = appError.message;
    isOperational = appError.isOperational;
  }
  // Handle validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
    isOperational = true;
  }
  // Handle session errors
  else if (error.name === 'SessionError') {
    statusCode = 401;
    message = 'Session error';
    isOperational = true;
  }

  // Log error details in development
  if (process.env['NODE_ENV'] === 'development') {
    console.error('Error Details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      statusCode,
      isOperational,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env['NODE_ENV'] === 'development' && {
      error: error.message,
      stack: error.stack,
    }),
  });
};
