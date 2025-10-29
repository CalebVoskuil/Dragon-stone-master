/**
 *
 */

/**
 *
 */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  LoginCredentials, 
  RegisterData, 
  User, 
  VolunteerLog, 
  CreateVolunteerLogData,
  School,
  Badge,
  BadgeProgress,
  CoordinatorDashboard,
  SchoolStats,
  Event
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      // API Base URL Configuration
      // - For iOS Simulator: use 'http://localhost:3001/api'
      // - For Android Emulator: use 'http://10.0.2.2:3001/api'
      // - For Physical Device: use your computer's IP (e.g., 'http://192.168.1.100:3001/api')
      // - For Production: update to your production API URL
      baseURL: 'http://192.168.0.208:3001/api', 
      timeout: 10000,
      withCredentials: true, // Important for session-based auth (cookies)
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add any auth headers if needed
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Handle different error scenarios
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          
          if (status === 401) {
            // Unauthorized - user needs to log in
            console.log('Unauthorized access - clearing auth state');
            // Auth state will be cleared by AuthContext
          } else if (status === 500) {
            console.error('Server error:', error.response.data);
          }
        } else if (error.request) {
          // Request made but no response received (network error)
          console.error('Network error - unable to connect to server');
          error.message = 'Unable to connect to server. Please check your connection.';
        } else {
          // Something else happened
          console.error('Request error:', error.message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await this.api.post('/auth/register', data);
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post('/auth/logout');
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/auth/profile');
    return response.data;
  }

  async getUserStats(): Promise<ApiResponse<{
    totalLogs: number;
    pendingLogs: number;
    approvedLogs: number;
    rejectedLogs: number;
    totalHours: number;
  }>> {
    const response: AxiosResponse<ApiResponse<{
      totalLogs: number;
      pendingLogs: number;
      approvedLogs: number;
      rejectedLogs: number;
      totalHours: number;
    }>> = await this.api.get('/users/stats');
    return response.data;
  }

  // Volunteer Log endpoints
  async getVolunteerLogs(params?: {
    page?: number;
    limit?: number;
    status?: string;
    schoolId?: string;
  }): Promise<ApiResponse<VolunteerLog[]>> {
    const response: AxiosResponse<ApiResponse<VolunteerLog[]>> = await this.api.get('/volunteer-logs', { params });
    return response.data;
  }

  async getVolunteerLogById(id: string): Promise<ApiResponse<VolunteerLog>> {
    const response: AxiosResponse<ApiResponse<VolunteerLog>> = await this.api.get(`/volunteer-logs/${id}`);
    return response.data;
  }

  async createVolunteerLog(data: CreateVolunteerLogData): Promise<ApiResponse<VolunteerLog>> {
    const formData = new FormData();
    formData.append('hours', data.hours.toString());
    formData.append('description', data.description);
    formData.append('date', data.date);
    formData.append('schoolId', data.schoolId);
    formData.append('claimType', data.claimType);
    
    if (data.eventId) {
      formData.append('eventId', data.eventId);
    }
    
    if (data.donationItems) {
      formData.append('donationItems', data.donationItems.toString());
    }
    
    if (data.proofFile) {
      // Format the file properly for FormData upload
      const fileData = {
        uri: (data.proofFile as any).uri,
        type: (data.proofFile as any).mimeType || 'image/jpeg',
        name: (data.proofFile as any).fileName || `proof-${Date.now()}.jpg`,
      };
      formData.append('proofFile', fileData as any);
    }

    const response: AxiosResponse<ApiResponse<VolunteerLog>> = await this.api.post('/volunteer-logs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateVolunteerLog(id: string, data: Partial<CreateVolunteerLogData>): Promise<ApiResponse<VolunteerLog>> {
    const response: AxiosResponse<ApiResponse<VolunteerLog>> = await this.api.put(`/volunteer-logs/${id}`, data);
    return response.data;
  }

  async deleteVolunteerLog(id: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/volunteer-logs/${id}`);
    return response.data;
  }

  // School endpoints
  async getSchools(): Promise<ApiResponse<School[]>> {
    const response: AxiosResponse<ApiResponse<School[]>> = await this.api.get('/schools');
    return response.data;
  }

  async getSchoolById(id: string): Promise<ApiResponse<School>> {
    const response: AxiosResponse<ApiResponse<School>> = await this.api.get(`/schools/${id}`);
    return response.data;
  }

  // Badge endpoints
  async getBadges(): Promise<ApiResponse<Badge[]>> {
    const response: AxiosResponse<ApiResponse<Badge[]>> = await this.api.get('/badges');
    return response.data;
  }

  async getUserBadges(userId: string): Promise<ApiResponse<{ badges: Badge[]; totalHours: number }>> {
    const response: AxiosResponse<ApiResponse<{ badges: Badge[]; totalHours: number }>> = await this.api.get(`/badges/user/${userId}`);
    return response.data;
  }

  async getBadgeProgress(userId: string): Promise<ApiResponse<{ totalHours: number; badgeProgress: BadgeProgress[] }>> {
    const response: AxiosResponse<ApiResponse<{ totalHours: number; badgeProgress: BadgeProgress[] }>> = await this.api.get(`/badges/progress/${userId}`);
    return response.data;
  }

  // Coordinator endpoints
  async getCoordinatorDashboard(): Promise<ApiResponse<CoordinatorDashboard>> {
    const response: AxiosResponse<ApiResponse<CoordinatorDashboard>> = await this.api.get('/coordinator/dashboard');
    return response.data;
  }

  async getPendingLogs(): Promise<ApiResponse<VolunteerLog[]>> {
    const response: AxiosResponse<ApiResponse<VolunteerLog[]>> = await this.api.get('/coordinator/pending-logs');
    return response.data;
  }

  async reviewVolunteerLog(logId: string, status: 'approved' | 'rejected', comment?: string): Promise<ApiResponse<VolunteerLog>> {
    const response: AxiosResponse<ApiResponse<VolunteerLog>> = await this.api.put(`/coordinator/review/${logId}`, {
      status,
      coordinatorComment: comment,
    });
    return response.data;
  }

  async getSchoolStats(schoolId: string): Promise<ApiResponse<SchoolStats>> {
    const response: AxiosResponse<ApiResponse<SchoolStats>> = await this.api.get(`/coordinator/school-stats/${schoolId}`);
    return response.data;
  }

  async getStudentsList(params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get('/coordinator/students', { params });
    return response.data;
  }

  async getLeaderboard(period?: 'week' | 'month' | 'year'): Promise<ApiResponse<any[]>> {
    const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get('/coordinator/leaderboard', {
      params: { period: period || 'month' }
    });
    return response.data;
  }

  // User endpoints
  async updateUser(userId: string, data: { 
    firstName?: string; 
    lastName?: string; 
    schoolId?: string; 
  }): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put(`/users/${userId}`, data);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/health');
    return response.data;
  }

  // Event endpoints
  async createEvent(data: {
    title: string;
    description: string;
    date: string;
    time?: string;
    location?: string;
    duration?: number;
    maxVolunteers: number;
    studentCoordinatorIds?: string[];
  }): Promise<ApiResponse<Event>> {
    const response: AxiosResponse<ApiResponse<Event>> = await this.api.post('/events', data);
    return response.data;
  }

  async getEvents(params?: { upcoming?: boolean }): Promise<ApiResponse<Event[]>> {
    const response: AxiosResponse<ApiResponse<Event[]>> = await this.api.get('/events', { params });
    return response.data;
  }

  async getEventById(id: string): Promise<ApiResponse<Event>> {
    const response: AxiosResponse<ApiResponse<Event>> = await this.api.get(`/events/${id}`);
    return response.data;
  }

  async updateEvent(id: string, data: {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    duration?: number;
    maxVolunteers?: number;
    studentCoordinatorIds?: string[];
  }): Promise<ApiResponse<Event>> {
    const response: AxiosResponse<ApiResponse<Event>> = await this.api.put(`/events/${id}`, data);
    return response.data;
  }

  async deleteEvent(id: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/events/${id}`);
    return response.data;
  }

  async registerForEvent(id: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.post(`/events/${id}/register`);
    return response.data;
  }

  async unregisterFromEvent(id: string): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.delete(`/events/${id}/register`);
    return response.data;
  }

  async getMyEvents(): Promise<ApiResponse<Event[]>> {
    const response: AxiosResponse<ApiResponse<Event[]>> = await this.api.get('/events/my-events');
    return response.data;
  }

  // Student Coordinator endpoints
  async getAssignedEvents(): Promise<ApiResponse<Event[]>> {
    const response: AxiosResponse<ApiResponse<Event[]>> = await this.api.get('/student-coordinator/assigned-events');
    return response.data;
  }

  async getPendingEventClaims(params?: { status?: string }): Promise<ApiResponse<VolunteerLog[]>> {
    const response: AxiosResponse<ApiResponse<VolunteerLog[]>> = await this.api.get('/student-coordinator/event-claims', { params });
    return response.data;
  }

  async reviewEventClaim(logId: string, status: 'approved' | 'rejected', comment?: string): Promise<ApiResponse<VolunteerLog>> {
    const response: AxiosResponse<ApiResponse<VolunteerLog>> = await this.api.put(`/student-coordinator/review-claim/${logId}`, {
      status,
      coordinatorComment: comment,
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
