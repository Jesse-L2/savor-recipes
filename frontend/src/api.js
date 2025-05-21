// src/api.js
import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust this to match your Django backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the access token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refreshing
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        
        if (!refreshToken) {
          // No refresh token available, redirect to login
          localStorage.removeItem(ACCESS_TOKEN);
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to get a new access token
        const response = await axios.post(
          'http://localhost:8000/api/token/refresh/',
          { refresh: refreshToken },
          { 
            headers: { 'Content-Type': 'application/json' },
            baseURL: undefined // Skip the baseURL for this specific request
          }
        );
        
        if (response.status === 200) {
          localStorage.setItem(ACCESS_TOKEN, response.data.access);
          
          // Update the authorization header for the original request
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Clear tokens and redirect to login
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
