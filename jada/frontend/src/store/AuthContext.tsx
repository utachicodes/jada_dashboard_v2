import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout } from '../api/authApi';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Set up axios interceptor for authentication
  useEffect(() => {
    // Add a request interceptor to include the token in all requests
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add a response interceptor to handle token refresh
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is due to an expired token and we haven't tried to refresh yet
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const response = await axios.post('/api/v1/auth/refreshToken');
            const { accessToken } = response.data;

            // Save the new token
            localStorage.setItem('accessToken', accessToken);

            // Update the authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            // Retry the original request
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, log out the user
            setUser(null);
            localStorage.removeItem('accessToken');
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Check if user is already logged in
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await getCurrentUser();
          setUser(response.user);
        } catch (error) {
          localStorage.removeItem('accessToken');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();

    // Clean up interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await apiLogin({ email, password });
      localStorage.setItem('accessToken', response.accessToken);
      setUser(response.user);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await apiRegister({ name, email, password });
      localStorage.setItem('accessToken', response.accessToken);
      setUser(response.user);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      localStorage.removeItem('accessToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, we should still clear local state
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};