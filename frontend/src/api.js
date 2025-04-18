import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

// const apiUrl = "http://127.0.0.1:8000"; // Update for web platform
// const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  // baseURL: "http://127.0.0.1:8000",
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    // console.log(token);
    if (token) {
      // pass a jwt access token
      // console.log(`Token: Bearer ${token}`);
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!token) {
      console.log("No token found.");
      // Redirect to login page
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        );

        if (response.status === 200) {
          // Update the token in storage
          localStorage.setItem(ACCESS_TOKEN, response.data.access);

          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
