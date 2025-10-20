import { Request } from 'express';
import { User } from '@prisma/client';

// Type definitions for string literals (SQLite doesn't support enums)
export type UserRole = 'STUDENT' | 'VOLUNTEER' | 'COORDINATOR' | 'ADMIN';
export type LogStatus = 'pending' | 'approved' | 'rejected';

// Extend Express Request to include user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Volunteer Log types
export interface CreateVolunteerLogRequest {
  hours: number;
  description: string;
  date: string;
  schoolId: string;
  proofFile?: Express.Multer.File;
}

export interface UpdateVolunteerLogRequest {
  hours?: number;
  description?: string;
  date?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

// Coordinator types
export interface ReviewVolunteerLogRequest {
  status: 'approved' | 'rejected';
  coordinatorComment?: string;
}

// Badge types
export interface BadgeProgress {
  badgeId: string;
  currentProgress: number;
  requiredProgress: number;
  isEarned: boolean;
}

// File upload types
export interface FileUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  uploadPath: string;
}

// Error types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Database query types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  status?: string;
  schoolId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}
