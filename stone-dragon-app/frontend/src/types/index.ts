// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'STUDENT' | 'VOLUNTEER' | 'COORDINATOR' | 'ADMIN';

// School types
export interface School {
  id: string;
  name: string;
  address?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Volunteer Log types
export interface VolunteerLog {
  id: string;
  hours: number;
  description: string;
  date: string;
  status: LogStatus;
  proofFileName?: string;
  proofFilePath?: string;
  coordinatorComment?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  userId: string;
  schoolId: string;
  reviewedBy?: string;
  user?: User;
  school?: School;
  reviewer?: User;
}

export type LogStatus = 'pending' | 'approved' | 'rejected';

// Badge types
export interface Badge {
  id: string;
  name: string;
  description: string;
  requiredHours: number;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: string;
  badge?: Badge;
}

export interface BadgeProgress {
  badgeId: string;
  badgeName: string;
  badgeDescription: string;
  requiredHours: number;
  currentHours: number;
  progress: number;
  isEarned: boolean;
  hoursRemaining: number;
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
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  schoolId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  LogHours: undefined;
  MyLogs: undefined;
  CoordinatorDashboard: undefined;
  Profile: undefined;
  Schools: undefined;
  Badges: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  LogHours: undefined;
  MyLogs: undefined;
  Profile: undefined;
  CoordinatorDashboard?: undefined;
};

// Form types
export interface CreateVolunteerLogData {
  hours: number;
  description: string;
  date: string;
  schoolId: string;
  proofFile?: File;
}

export interface UpdateVolunteerLogData {
  hours?: number;
  description?: string;
  date?: string;
}

export interface ReviewVolunteerLogData {
  status: 'approved' | 'rejected';
  coordinatorComment?: string;
}

// Coordinator types
export interface CoordinatorDashboard {
  schools: SchoolStats[];
}

export interface SchoolStats {
  schoolId: string;
  schoolName: string;
  totalLogs: number;
  pendingLogs: number;
  approvedLogs: number;
  totalHours: number;
}

// File upload types
export interface FileUploadResult {
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}
