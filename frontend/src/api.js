import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// const apiUrl = "http://127.0.0.1:8000"; // Update for web platform
// const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    console.log(token);
    if (token) {
      // pass a jwt access token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    return Promise.reject(error);
  }
);

export default api;
