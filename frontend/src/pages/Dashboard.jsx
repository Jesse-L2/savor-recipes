// frontend/src/pages/Dashboard.jsx
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import RecipeList from "../components/RecipeList";
import RecipeForm from "../components/RecipeForm";
import RecipeDetail from "../components/RecipeDetail";

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg rounded-lg m-6 h-fit">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Savor Recipes</h1>
          <p className="text-sm text-gray-600">
            Welcome,{" "}
            {user.first_name
              ? user.first_name
              : user.username
              ? user.username
              : "User"}
            !
          </p>
        </div>
        <nav className="mt-6 flex flex-col gap-2 px-4 pb-4">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 pl-2">
            Navigation
          </div>
          <Link
            to="/dashboard/all"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition-colors"
          >
            All Recipes
          </Link>
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition-colors"
          >
            My Recipes
          </Link>
          <Link
            to="/dashboard/recipes/new"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition-colors"
          >
            Add New Recipe
          </Link>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-red-100 transition-colors mt-2"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route index element={<RecipeList />} />
          <Route path="all" element={<RecipeList allRecipes={true} />} />
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
