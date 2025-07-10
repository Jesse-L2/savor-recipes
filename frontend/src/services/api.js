import axios from "axios";

// Base URL for your Django backend API
// Make sure this matches your Django server's address
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach the access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // If the error is 401 Unauthorized and it's not a login/refresh request,
    // and we haven't already retried the request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to prevent infinite loops
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;
          const newRefreshToken = response.data.refresh; // Refresh token might also be new

          // Store the new tokens
          localStorage.setItem("access_token", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }

          // Update the original request's header with the new access token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails (e.g., refresh token expired or invalid), log out the user
          console.error("Token refresh failed:", refreshError);
          // You might want to dispatch a logout action here
          // For now, we'll just remove tokens and redirect (or let AuthContext handle it)
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          // Optionally, redirect to login page or show a message
          window.location.href = "/login"; // Simple redirect for demonstration
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, redirect to login
        console.warn("No refresh token found. Redirecting to login.");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
