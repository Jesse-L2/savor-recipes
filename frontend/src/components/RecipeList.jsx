// frontend/src/components/RecipeList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import PropTypes from "prop-types";

const RecipeList = ({ allRecipes = false }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [pageUrl, setPageUrl] = useState("/api/recipes/");

  const fetchRecipes = async (url = "/api/recipes/", searchQuery = "") => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      const response = await api.get(url, { params });
      setRecipes(response.data.results);
      setNext(response.data.next);
      setPrevious(response.data.previous);
      setCount(response.data.count);
    } catch (err) {
      setError("Failed to fetch recipes");
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(pageUrl, search);
    // eslint-disable-next-line
  }, [pageUrl, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPageUrl("/api/recipes/"); // Reset to first page on new search
  };

  const handleNext = () => {
    if (next) setPageUrl(next.replace(/^.*\/api\//, "/api/"));
  };
  const handlePrevious = () => {
    if (previous) setPageUrl(previous.replace(/^.*\/api\//, "/api/"));
  };

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold">
          {allRecipes ? "All Recipes" : "My Recipes"}
        </h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search recipes..."
            className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {!allRecipes && (
            <Link
              to="/dashboard/recipes/new"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add New Recipe
            </Link>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {recipe.description || recipe.content}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {new Date(recipe.created_at).toLocaleDateString()}
              </span>
              <Link
                to={`/dashboard/recipes/${recipe.id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                View Recipe
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrevious}
          disabled={!previous}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Showing {recipes.length} of {count} recipes
        </span>
        <button
          onClick={handleNext}
          disabled={!next}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

RecipeList.propTypes = {
  allRecipes: PropTypes.bool,
};

export default RecipeList;
