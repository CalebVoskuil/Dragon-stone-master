/**
 * @fileoverview TypeScript type definitions for the Stone Dragon API.
 * Contains interfaces, types, and type extensions for Express.
 * 
 * @module types
 * @requires express
 */

import { Request } from 'express';

/**
 * Extend Express Request to include session data.
 * This module augmentation adds session property to Express Request type.
 */
declare module 'express-serve-static-core' {
  interface Request {
    session: any;
  }
}

/**
 * User role type definition.
 * Defines the possible roles a user can have in the system.
 * 
 * @typedef {string} UserRole
 */
export type UserRole = 'STUDENT' | 'COORDINATOR' | 'STUDENT_COORDINATOR' | 'ADMIN';

/**
 * Volunteer log status type definition.
 * Defines the possible statuses for a volunteer log entry.
 * 
 * @typedef {string} LogStatus
 */
export type LogStatus = 'pending' | 'approved' | 'rejected';

/**
 * Authenticated Express Request interface.
 * Extends the base Express Request to include authenticated user data.
 * 
 * @interface AuthenticatedRequest
 * @extends {Request}
 * @property {any} [user] - The authenticated user object
 */
export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Generic API response interface.
 * Standard response format for all API endpoints.
 * 
 * @interface ApiResponse
 * @template T - The type of data returned in the response
 * @property {boolean} success - Whether the request was successful
 * @property {string} message - Human-readable response message
 * @property {T} [data] - Optional response data payload
 * @property {string} [error] - Optional error message
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Paginated API response interface.
 * Extends ApiResponse to include pagination metadata.
 * 
 * @interface PaginatedResponse
 * @template T - The type of items in the paginated array
 * @extends {ApiResponse<T[]>}
 * @property {Object} pagination - Pagination metadata
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Login request interface.
 * Contains credentials for user authentication.
 * 
 * @interface LoginRequest
 * @property {string} email - User's email address
 * @property {string} password - User's password
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Registration request interface.
 * Contains data needed to create a new user account.
 * 
 * @interface RegisterRequest
 * @property {string} email - User's email address
 * @property {string} password - User's password (will be hashed)
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {UserRole} role - User's role in the system
 * @property {string} [schoolId] - Optional school ID for student/coordinator affiliation
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
}

/**
 * Authentication response interface.
 * Contains authenticated user data returned after successful login/registration.
 * 
 * @interface AuthResponse
 * @property {any} user - The authenticated user object
 */
export interface AuthResponse {
  user: any;
}

/**
 * Create volunteer log request interface.
 * Contains data needed to create a new volunteer log entry.
 * 
 * @interface CreateVolunteerLogRequest
 * @property {number} hours - Number of volunteer hours
 * @property {string} description - Description of volunteer activity
 * @property {string} date - Date of volunteer activity (ISO string)
 * @property {string} schoolId - ID of the school associated with the activity
 * @property {Express.Multer.File} [proofFile] - Optional uploaded proof file
 */
export interface CreateVolunteerLogRequest {
  hours: number;
  description: string;
  date: string;
  schoolId: string;
  proofFile?: Express.Multer.File;
}

/**
 * Update volunteer log request interface.
 * Contains optional fields that can be updated in a volunteer log.
 * 
 * @interface UpdateVolunteerLogRequest
 * @property {number} [hours] - Updated number of hours
 * @property {string} [description] - Updated description
 * @property {string} [date] - Updated date
 * @property {'pending' | 'approved' | 'rejected'} [status] - Updated status
 */
export interface UpdateVolunteerLogRequest {
  hours?: number;
  description?: string;
  date?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

/**
 * Review volunteer log request interface.
 * Contains data needed for a coordinator to review a volunteer log.
 * 
 * @interface ReviewVolunteerLogRequest
 * @property {'approved' | 'rejected'} status - Review decision
 * @property {string} [coordinatorComment] - Optional comment from coordinator
 */
export interface ReviewVolunteerLogRequest {
  status: 'approved' | 'rejected';
  coordinatorComment?: string;
}

/**
 * Badge progress interface.
 * Represents a user's progress toward earning a specific badge.
 * 
 * @interface BadgeProgress
 * @property {string} badgeId - Unique identifier for the badge
 * @property {number} currentProgress - Current progress value (e.g., hours completed)
 * @property {number} requiredProgress - Required value to earn the badge
 * @property {boolean} isEarned - Whether the badge has been earned
 */
export interface BadgeProgress {
  badgeId: string;
  currentProgress: number;
  requiredProgress: number;
  isEarned: boolean;
}

/**
 * File upload configuration interface.
 * Defines constraints and settings for file uploads.
 * 
 * @interface FileUploadConfig
 * @property {number} maxSize - Maximum file size in bytes
 * @property {string[]} allowedTypes - Array of allowed MIME types
 * @property {string} uploadPath - Filesystem path for storing uploads
 */
export interface FileUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  uploadPath: string;
}

/**
 * Application error interface.
 * Custom error type with HTTP status code and operational flag.
 * 
 * @interface AppError
 * @extends {Error}
 * @property {number} statusCode - HTTP status code for the error
 * @property {boolean} isOperational - Whether error is operational (expected) or programming error
 */
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

/**
 * Pagination parameters interface.
 * Defines parameters for paginating database query results.
 * 
 * @interface PaginationParams
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Number of items per page
 * @property {string} [sortBy] - Field name to sort by
 * @property {'asc' | 'desc'} [sortOrder] - Sort order direction
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter parameters interface.
 * Defines optional filters for querying database records.
 * 
 * @interface FilterParams
 * @property {string} [status] - Filter by status (e.g., 'pending', 'approved')
 * @property {string} [schoolId] - Filter by school ID
 * @property {string} [userId] - Filter by user ID
 * @property {string} [dateFrom] - Filter by start date (ISO string)
 * @property {string} [dateTo] - Filter by end date (ISO string)
 */
export interface FilterParams {
  status?: string;
  schoolId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

/* End of file types/index.ts */
