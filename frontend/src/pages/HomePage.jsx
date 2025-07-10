import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../services/api";
import RecipeCard from "../components/RecipeCard";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allTags, setAllTags] = useState([]); // To fetch all available tags
  const [selectedTagSlug, setSelectedTagSlug] = useState(""); // For filtering by tag
  const [searchTerm, setSearchTerm] = useState(""); // For general search
  const location = useLocation(); // To read query parameters
  const navigate = useNavigate(); // To update URL query parameters

  // Fetch all tags on component mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get("/recipes/tags/");
        setAllTags(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
        // Optionally set an error state for tags specifically
      }
    };
    fetchTags();
  }, []);

  // Effect to read query parameters and set initial filters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tagFromUrl = queryParams.get("tag");
    const searchFromUrl = queryParams.get("search");

    setSelectedTagSlug(tagFromUrl || "");
    setSearchTerm(searchFromUrl || "");
  }, [location.search]);

  // Effect to fetch recipes based on filters
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (selectedTagSlug) {
          params.tags__slug = selectedTagSlug; // Filter by tag slug
        }
        if (searchTerm) {
          params.search = searchTerm; // Search by term
        }

        const response = await api.get("/recipes/recipes/", { params });
        setRecipes(
          Array.isArray(response.data.results) ? response.data.results : []
        );
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setError("Failed to load recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedTagSlug, searchTerm]); // Re-fetch when selected tag or search term changes

  const handleTagFilterChange = (e) => {
    const newTagSlug = e.target.value;
    setSelectedTagSlug(newTagSlug);
    // Update URL to reflect the filter
    const queryParams = new URLSearchParams(location.search);
    if (newTagSlug) {
      queryParams.set("tag", newTagSlug);
    } else {
      queryParams.delete("tag");
    }
    navigate(`?${queryParams.toString()}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(location.search);
    if (searchTerm) {
      queryParams.set("search", searchTerm);
    } else {
      queryParams.delete("search");
    }
    navigate(`?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center text-lg mt-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Discover Recipes
      </h1>

      {/* Filter and Search Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 flex flex-col sm:flex-row gap-4">
        {/* Tag Filter */}
        <div className="flex-1">
          <label
            htmlFor="tag-filter"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Filter by Tag:
          </label>
          <select
            id="tag-filter"
            value={selectedTagSlug}
            onChange={handleTagFilterChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag.id} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="flex-1">
          <label
            htmlFor="search-input"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Search Recipes:
          </label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              id="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title, ingredient..."
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
            />
            <button
              type="submit"
              className="bg-primary text-white p-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 shadow-md"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Recipe List */}
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 text-lg mt-10 p-4 bg-white rounded-xl shadow-lg">
          No recipes found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default HomePage;
