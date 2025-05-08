import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Base API URL - use your machine's IP address instead of localhost for mobile devices
const API_URL = 'http://10.1.88.15:5001/api'; 

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth related API calls
export const authAPI = {
  // Register a new user
  register: async (userData: {
    email: string;
    password: string;
    username: string;
    name?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    
    // Store token in AsyncStorage
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout user
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  },

  // Get current user data
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },
};

// User related API calls
export const userAPI = {
  // Get user profile by username
  getUserProfile: async (username: string) => {
    const response = await api.get(`/users/profile/${username}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: {
    username?: string;
    name?: string;
    bio?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
};

// Image related API calls
export const imageAPI = {
  // Create a new image
  createImage: async (imageData: {
    prompt: string;
    imageUrl: string;
    preset?: string;
    width?: number;
    height?: number;
  }) => {
    const response = await api.post('/images', imageData);
    return response.data;
  },

  // Get all images with optional filters
  getAllImages: async (params?: {
    userId?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/images', { params });
    return response.data;
  },

  // Get image by ID
  getImageById: async (id: string) => {
    const response = await api.get(`/images/${id}`);
    return response.data;
  },

  // Delete image
  deleteImage: async (id: string) => {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  },
};

export default api; 