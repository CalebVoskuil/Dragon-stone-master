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
  SchoolStats
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3001/api',
      timeout: 10000,
      withCredentials: true, // Important for session-based auth
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
        if (error.response?.status === 401) {
          // Handle unauthorized access
          // You might want to redirect to login or clear auth state
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
    
    if (data.proofFile) {
      formData.append('proofFile', data.proofFile as any);
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

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response: AxiosResponse<ApiResponse> = await this.api.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
