import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Checking stored auth...');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    console.log('AuthProvider: Stored token exists:', !!storedToken);
    console.log('AuthProvider: Stored user exists:', !!storedUser);

    if (storedToken && storedUser) {
      console.log('AuthProvider: Restoring session');
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      console.log('AuthProvider: No stored session found');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting login...');
    try {
      const response = await authAPI.login(email, password);
      console.log('AuthProvider: Login response received');
      const { user: userData, token: authToken } = response.data.data;

      console.log('AuthProvider: Setting user and token');
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('AuthProvider: Login successful, auth state updated');
    } catch (error: any) {
      console.log('AuthProvider: Login failed:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    console.log('AuthProvider: Logging out...');
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  console.log('AuthProvider: Render - isLoading:', isLoading, 'isAuthenticated:', !!token && !!user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
