import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  school: string;
  role: 'student' | 'coordinator' | 'admin-student' | 'admin-coordinator';
  isMinor: boolean;
  consentStatus?: 'pending' | 'approved' | 'rejected' | null;
  totalHours: number;
  currentStreak: number;
  totalPoints: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  school: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app start
    const storedUser = localStorage.getItem('sd_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Mock authentication - in real app, this would call your API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    // Mock user data based on email
    let mockUser: User;
    
    if (email.includes('admin-student')) {
      mockUser = {
        id: '3',
        name: 'Admin Student View',
        email,
        dateOfBirth: '2005-03-20',
        school: 'Cape Town High School',
        role: 'admin-student',
        isMinor: false,
        consentStatus: 'approved',
        totalHours: 42,
        currentStreak: 5,
        totalPoints: 850
      };
    } else if (email.includes('admin-coordinator')) {
      mockUser = {
        id: '4',
        name: 'Admin Coordinator View',
        email,
        dateOfBirth: '1985-06-15',
        school: 'Cape Town High School',
        role: 'admin-coordinator',
        isMinor: false,
        consentStatus: null,
        totalHours: 0,
        currentStreak: 0,
        totalPoints: 0
      };
    } else if (email.includes('coordinator') || email.includes('admin')) {
      mockUser = {
        id: '2',
        name: 'Sarah Johnson',
        email,
        dateOfBirth: '1985-06-15',
        school: 'Cape Town High School',
        role: 'coordinator',
        isMinor: false,
        consentStatus: null,
        totalHours: 0,
        currentStreak: 0,
        totalPoints: 0
      };
    } else {
      mockUser = {
        id: '1',
        name: 'Alex Smith',
        email,
        dateOfBirth: '2005-03-20',
        school: 'Cape Town High School',
        role: 'student',
        isMinor: new Date().getFullYear() - new Date('2005-03-20').getFullYear() < 18,
        consentStatus: 'approved',
        totalHours: 42,
        currentStreak: 5,
        totalPoints: 850
      };
    }

    localStorage.setItem('sd_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const birthYear = new Date(userData.dateOfBirth).getFullYear();
    const currentYear = new Date().getFullYear();
    const isMinor = currentYear - birthYear < 18;
    
    const newUser: User = {
      id: '1',
      name: userData.name,
      email: userData.email,
      dateOfBirth: userData.dateOfBirth,
      school: userData.school,
      role: 'student',
      isMinor,
      consentStatus: isMinor ? 'pending' : null,
      totalHours: 0,
      currentStreak: 0,
      totalPoints: 0
    };

    localStorage.setItem('sd_user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('sd_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}