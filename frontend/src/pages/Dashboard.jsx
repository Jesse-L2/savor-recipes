// frontend/src/pages/Dashboard.jsx
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RecipeList from '../components/RecipeList';
import RecipeForm from '../components/RecipeForm';
import RecipeDetail from '../components/RecipeDetail';

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Savor Recipes</h1>
          <p className="text-sm text-gray-600">Welcome, {user.username}!</p>
        </div>
        <nav className="mt-8">
          <Link
            to="/dashboard"
            className="block px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            My Recipes
          </Link>
          <Link
            to="/dashboard/recipes/new"
            className="block px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            Add New Recipe
          </Link>
          <button
            onClick={logout}
            className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route index element={<RecipeList />} />
          <Route path="recipes">
            <Route path="new" element={<RecipeForm />} />
            <Route path=":id" element={<RecipeDetail />} />
            <Route path=":id/edit" element={<RecipeForm />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;