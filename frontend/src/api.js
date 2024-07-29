import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// const apiUrl = "http://127.0.0.1:8000"; // Update for web platform
// const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  // baseURL: "http://127.0.0.1:8000",
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log(token);
    if (token) {
      // pass a jwt access token
      console.log(`Token: Bearer ${token}`);
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

export default api;
