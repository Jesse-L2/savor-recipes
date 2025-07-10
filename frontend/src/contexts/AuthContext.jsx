import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api"; // Import the configured Axios instance
import { useNavigate } from "react-router-dom";

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to easily access the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data if authenticated
  const [loading, setLoading] = useState(true); // Manages loading state during initial auth check
  const navigate = useNavigate();

  // Function to get user data from the backend using the access token
  const fetchUserData = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        // Fetch user profile data using the API instance
        const response = await api.get("/users/profile/");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // If fetching user data fails (e.g., token invalid), clear tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        // No immediate redirect here, let the interceptor handle 401 or let protected routes redirect
      }
    }
    setLoading(false); // Authentication check is complete
  };

  // On initial load, try to fetch user data if tokens exist
  useEffect(() => {
    fetchUserData();
  }, []); // Run only once on component mount

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post("/token/", { email, password });
      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // After successful login, fetch user profile
      await fetchUserData();
      navigate("/dashboard"); // Redirect to dashboard or home page
      return true; // Indicate success
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setUser(null); // Ensure user is null on failed login
      throw error; // Re-throw to allow components to handle errors
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await api.post("/users/register/", userData);
      // After successful registration, you might want to automatically log them in
      // or redirect them to the login page.
      console.log("Registration successful:", response.data);
      // Optionally, call login directly if you want auto-login after register
      // await login(userData.email, userData.password);
      navigate("/login"); // Redirect to login page after successful registration
      return true;
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/login"); // Redirect to login page on logout
  };

  // Context value to be provided to consumers
  const authContextValue = {
    user,
    isAuthenticated: !!user, // Boolean flag for authentication status
    loading,
    login,
    register,
    logout,
    fetchUserData, // Expose fetchUserData for manual refresh if needed
  };

  // Provide the context value to children
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
