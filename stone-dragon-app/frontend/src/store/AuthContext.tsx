/**
 *
 */

/**
 *
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { RegisterData as ApiRegisterData, UserRole } from '../types';

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'COORDINATOR' | 'STUDENT_COORDINATOR' | 'ADMIN';
  schoolId?: string;
  school?: string; // School name
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  school: string;
  dateOfBirth: string;
}

// Auth Context Type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Try to load user from storage first
      const savedUser = await AsyncStorage.getItem('@user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      // Verify with backend
      const response = await apiService.getProfile();
      if (response.success && response.data) {
        const userData = response.data as User;
        setUser(userData);
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
      } else {
        // Profile check failed, clear local data
        setUser(null);
        await AsyncStorage.removeItem('@user');
      }
    } catch (error) {
      // Not authenticated or network error
      console.log('Auth check failed:', error);
      setUser(null);
      await AsyncStorage.removeItem('@user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Attempting login for:', credentials.email);
      const response = await apiService.login(credentials);
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        const userData = response.data.user as User;
        console.log('Setting user:', userData);
        setUser(userData);
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
        console.log('User saved to storage');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Split name into firstName and lastName
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || firstName;

      // Map frontend data to backend format
      const registerPayload: ApiRegisterData = {
        email: data.email,
        password: data.password,
        firstName,
        lastName,
        role: 'STUDENT' as UserRole,
        schoolId: data.school, // Assuming school is already schoolId from picker
      };

      const response = await apiService.register(registerPayload);
      
      if (response.success && response.data) {
        const userData = response.data.user as User;
        setUser(userData);
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call backend logout
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local state and storage
      setUser(null);
      await AsyncStorage.removeItem('@user');
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Auth Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
