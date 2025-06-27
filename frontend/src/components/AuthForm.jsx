// src/components/AuthForm.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";

const AuthForm = ({ method }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let success;

      if (method === "login") {
        success = await login(username, password);
        if (success) {
          navigate("/dashboard");
        } else {
          setError("Invalid credentials");
        }
      } else {
        success = await register(username, password);
        if (success) {
          navigate("/login");
          alert("Registration successful! Please login.");
        } else {
          setError("Registration failed. Username may already be taken.");
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-green-100">
      <nav className="absolute top-0 left-0 w-full flex justify-center bg-white shadow py-4 z-10">
        <div className="flex gap-8">
          <Link
            to="/login"
            className={`text-lg font-semibold px-2 py-1 rounded ${
              method === "login"
                ? "text-indigo-700 border-b-2 border-indigo-700"
                : "text-gray-600 hover:text-indigo-700"
            }`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`text-lg font-semibold px-2 py-1 rounded ${
              method === "register"
                ? "text-indigo-700 border-b-2 border-indigo-700"
                : "text-gray-600 hover:text-indigo-700"
            }`}
          >
            Register
          </Link>
        </div>
      </nav>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl px-10 py-8 w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-2">
          {name}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center border border-red-200">
            {error}
          </div>
        )}

        <input
          className="form-input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-lg"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="User Name"
          required
        />

        <input
          className="form-input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-lg"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button
          className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
          type="submit"
        >
          {name}
        </button>
      </form>
    </div>
  );
};

AuthForm.propTypes = {
  method: PropTypes.oneOf(["login", "register"]).isRequired,
};

export default AuthForm;
