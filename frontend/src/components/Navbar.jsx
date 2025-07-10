import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import the custom auth hook

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth(); // Get auth state and functions from context

  return (
    <nav className="bg-primary p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Site Title */}
        <Link
          to="/"
          className="text-white text-2xl font-bold rounded-md px-2 py-1 hover:bg-primary-dark transition-colors duration-200"
        >
          RecipeApp
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-white hover:text-accent transition-colors duration-200 rounded-md px-3 py-2"
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/recipes/new"
                className="text-white hover:text-accent transition-colors duration-200 rounded-md px-3 py-2"
              >
                Add Recipe
              </Link>
              <Link
                to="/dashboard"
                className="text-white hover:text-accent transition-colors duration-200 rounded-md px-3 py-2"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-white hover:text-accent transition-colors duration-200 rounded-md px-3 py-2"
              >
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-white text-lg hidden md:block">
                Hello, {user?.first_name || user?.email}!
              </span>
              <button
                onClick={logout}
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
