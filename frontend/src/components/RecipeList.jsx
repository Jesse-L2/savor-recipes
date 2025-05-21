// frontend/src/components/RecipeList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/api/recipes/');
        setRecipes(response.data);
      } catch (err) {
        setError('Failed to fetch recipes');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <div>Loading recipes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">My Recipes</h2>
        <Link
          to="/dashboard/recipes/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Recipe
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
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
    </div>
  );
};

export default RecipeList;