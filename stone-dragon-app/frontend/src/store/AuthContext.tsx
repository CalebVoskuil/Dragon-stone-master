import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'COORDINATOR' | 'ADMIN';
  school?: string;
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
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: 'STUDENT' | 'COORDINATOR') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users
const MOCK_USERS = {
  student: {
    id: '1',
    email: 'student@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'STUDENT' as const,
    school: 'Cape Town High School',
  },
  coordinator: {
    id: '2',
    email: 'coordinator@example.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'COORDINATOR' as const,
    school: 'Cape Town High School',
  },
};

// Auth Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('@user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock login - accept any email/password
    let mockUser: User;
    
    if (credentials.email.includes('coordinator') || credentials.email.includes('admin')) {
      mockUser = MOCK_USERS.coordinator;
    } else {
      mockUser = MOCK_USERS.student;
    }

    // Save to storage
    await AsyncStorage.setItem('@user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create new student user
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      firstName: data.name.split(' ')[0],
      lastName: data.name.split(' ')[1] || '',
      role: 'STUDENT',
      school: data.school,
    };

    // Save to storage
    await AsyncStorage.setItem('@user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem('@user');
    setUser(null);
    setIsLoading(false);
  };

  const switchRole = (role: 'STUDENT' | 'COORDINATOR') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    switchRole,
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
