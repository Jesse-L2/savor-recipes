import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Ensure Navigate is imported
import { useAuth } from "./contexts/AuthContext"; // Corrected import path
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RecipeFormPage from "./pages/RecipeFormPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // Import new password reset pages
import ResetPasswordConfirmPage from "./pages/ResetPasswordConfirmPage"; // Import new password reset pages
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

// ProtectedRoute component to guard routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show a loading spinner while authentication status is being checked
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (the protected component)
  return children;
};

function App() {
  const { loading } = useAuth(); // Get loading state from AuthContext

  if (loading) {
    // Show a global loading spinner while the initial auth check is happening
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar will be present on all pages */}
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recipes/:slug" element={<RecipeDetailPage />} />

          {/* Password Reset Routes */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* uidb64 and token are URL parameters provided by Django's password reset email link */}
          <Route
            path="/reset-password-confirm/:uidb64/:token"
            element={<ResetPasswordConfirmPage />}
          />

          {/* Protected Routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/new"
            element={
              <ProtectedRoute>
                <RecipeFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/:slug/edit"
            element={
              <ProtectedRoute>
                <RecipeFormPage /> {/* Re-use form for editing */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Optional: Add a Footer component here */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;
