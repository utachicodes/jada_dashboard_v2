import axios from 'axios';

const AUTH_API_URL = '/api/v1/auth';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  type: string;
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
}

// Register a new user
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user info
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get(`${AUTH_API_URL}/me`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Refresh token
export const refreshToken = async (): Promise<{ accessToken: string }> => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/refreshToken`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = async (): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/logout`);
    return response.data;
  } catch (error) {
    throw error;
  }
};