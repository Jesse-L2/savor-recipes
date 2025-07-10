import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import RecipeCard from "../components/RecipeCard";
import LoadingSpinner from "../components/LoadingSpinner";

const DashboardPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [userRecipes, setUserRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch recipes if user is authenticated and user data is available
    if (isAuthenticated && user) {
      const fetchUserRecipes = async () => {
        setLoadingRecipes(true);
        setError(null);
        try {
          // Fetch recipes filtered by the current user's ID
          const response = await api.get(
            `/recipes/recipes/?author__id=${user.id}`
          );
          setUserRecipes(response.data.results);
        } catch (err) {
          console.error("Failed to fetch user recipes:", err);
          setError("Failed to load your recipes. Please try again later.");
        } finally {
          setLoadingRecipes(false);
        }
      };
      fetchUserRecipes();
    } else if (!authLoading && !isAuthenticated) {
      // If not authenticated and auth check is done, no recipes to load
      setLoadingRecipes(false);
    }
  }, [isAuthenticated, user, authLoading]); // Re-run when auth state or user changes

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    // This case should ideally be handled by ProtectedRoute, but good for fallback
    return (
      <div className="text-center text-lg text-gray-600 mt-8">
        Please log in to view your dashboard.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Your Dashboard
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Welcome, {user?.first_name || user?.email}!
        </h2>
        <p className="text-gray-600 mb-4">
          Here you can manage your recipes and profile settings.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/recipes/new"
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 shadow-md flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            Create New Recipe
          </Link>
          <Link
            to="/profile"
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 shadow-md flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
            Manage Profile
          </Link>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-6 mt-10 text-center">
        Your Recipes ({userRecipes.length})
      </h2>

      {loadingRecipes && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center text-lg mt-4">{error}</div>
      )}

      {!loadingRecipes && !error && userRecipes.length === 0 && (
        <div className="text-center text-gray-600 text-lg mt-8">
          You haven't created any recipes yet. Start by creating your first one!
        </div>
      )}

      {!loadingRecipes && !error && userRecipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
