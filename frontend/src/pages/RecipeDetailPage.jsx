import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext"; // Ensure this path is correct for your AuthContext

const RecipeDetailPage = () => {
  const { slug } = useParams(); // Get the recipe slug from the URL
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // Get authenticated user info
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation modal

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/recipes/recipes/${slug}/`);
        setRecipe(response.data);
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
        if (err.response && err.response.status === 404) {
          setError("Recipe not found.");
        } else {
          setError("Failed to load recipe. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [slug]); // Re-fetch when slug changes

  const handleDelete = async () => {
    if (!recipe || !user || recipe.author.id !== user.id) {
      setError("You are not authorized to delete this recipe.");
      return;
    }

    setLoading(true); // Show loading during delete operation
    try {
      await api.delete(`/recipes/recipes/${recipe.slug}/`);
      alert("Recipe deleted successfully!"); // Use a custom modal instead of alert in a real app
      navigate("/dashboard"); // Redirect to dashboard after deletion
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      setError("Failed to delete recipe. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false); // Close confirmation modal
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center text-lg mt-8">
        {error}
        {error === "Recipe not found." && (
          <p className="mt-2 text-gray-600">
            Go back to{" "}
            <Link to="/" className="text-primary hover:underline">
              Home
            </Link>
          </p>
        )}
      </div>
    );
  }

  if (!recipe) {
    return null; // Should not happen if loading and error are handled
  }

  // Check if the authenticated user is the author of the recipe
  const isAuthor = isAuthenticated && user && recipe.author.id === user.id;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Recipe Image */}
          <div className="md:w-1/2 flex-shrink-0">
            <img
              src={
                recipe.main_image ||
                "https://placehold.co/600x400/E0E0E0/6B7280?text=No+Image"
              }
              alt={recipe.title}
              className="w-full h-auto rounded-lg shadow-md object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/600x400/E0E0E0/6B7280?text=No+Image";
              }}
            />
          </div>

          {/* Recipe Header and Meta */}
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {recipe.title}
            </h1>
            <p className="text-gray-600 text-lg mb-4">{recipe.description}</p>

            <div className="flex items-center text-gray-500 mb-4 text-sm">
              <span className="font-medium mr-2">
                By{" "}
                {recipe.author.first_name || recipe.author.email.split("@")[0]}
              </span>
              {recipe.average_rating !== undefined && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.532 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.777.565-1.832-.197-1.532-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.725c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                  <span>
                    {parseFloat(recipe.average_rating || 0).toFixed(1)}
                  </span>{" "}
                  {/* Ensure it's a number */}
                  {recipe.rating_count > 0 && (
                    <span className="ml-1">
                      ({recipe.rating_count} ratings)
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-gray-700">
              {recipe.prep_time_minutes && (
                <div>
                  <span className="font-semibold">Prep Time:</span>{" "}
                  {recipe.prep_time_minutes} mins
                </div>
              )}
              {recipe.cook_time_minutes && (
                <div>
                  <span className="font-semibold">Cook Time:</span>{" "}
                  {recipe.cook_time_minutes} mins
                </div>
              )}
              {recipe.servings && (
                <div>
                  <span className="font-semibold">Servings:</span>{" "}
                  {recipe.servings}
                </div>
              )}
              {recipe.difficulty && (
                <div>
                  <span className="font-semibold">Difficulty:</span>{" "}
                  {recipe.difficulty}
                </div>
              )}
            </div>

            {/* Tags and Equipment */}
            <div className="mb-6">
              {/* Display all tags (formerly categories and tags) */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="font-semibold text-gray-700">Tags:</span>
                  {recipe.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/?tag=${tag.slug}`}
                      className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full hover:bg-purple-200 transition-colors duration-200"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
              {recipe.equipment && recipe.equipment.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="font-semibold text-gray-700">
                    Equipment:
                  </span>
                  {recipe.equipment.map((eq) => (
                    <span
                      key={eq.id}
                      className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {eq.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Author Actions (Edit/Delete) */}
            {isAuthor && (
              <div className="mt-6 flex gap-4">
                <Link
                  to={`/recipes/${recipe.slug}/edit`}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 shadow-md flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-1.64 1.64l-4.707 4.707a1 1 0 00-.293.707v4.586h4.586a1 1 0 00.707-.293l4.707-4.707-2.828-2.828-4.707 4.707z" />
                  </svg>
                  Edit Recipe
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200 shadow-md flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h2a1 1 0 110 2H10a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Delete Recipe
                </button>
              </div>
            )}
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Ingredients Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ingredients</h2>
          <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
            {recipe.ingredients &&
            Array.isArray(recipe.ingredients) &&
            recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-primary">&bull;</span>
                  {item.item} {item.quantity ? `- ${item.quantity}` : ""}
                </li>
              ))
            ) : (
              <p className="text-gray-600">No ingredients listed.</p>
            )}
          </ul>
        </div>

        {/* Instructions Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Instructions
          </h2>
          <ol className="list-decimal list-inside text-lg text-gray-700 space-y-3">
            {recipe.instructions &&
            Array.isArray(recipe.instructions) &&
            recipe.instructions.length > 0 ? (
              recipe.instructions.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 font-semibold text-primary">
                    {index + 1}.
                  </span>
                  {step}
                </li>
              ))
            ) : (
              <p className="text-gray-600">No instructions provided.</p>
            )}
          </ol>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the recipe "{recipe.title}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailPage;
