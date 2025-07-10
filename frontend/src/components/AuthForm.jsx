// src/components/AuthForm.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";

const AuthForm = ({ method }) => {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [password, setPassword] = useState(""); // for login only
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Password reset states
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetError, setResetError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let success;
      if (method === "login") {
        success = await login(email, password);
        if (success) {
          navigate("/dashboard");
        } else {
          setError("Invalid credentials");
        }
      } else {
        // Registration
        if (!email) {
          setError("Email is required");
          return;
        }
        if (!password1 || !password2) {
          setError("Both password fields are required");
          return;
        }
        if (password1 !== password2) {
          setError("Passwords do not match");
          return;
        }
        if (!firstName) {
          setError("First name is required");
          return;
        }
        if (!lastName) {
          setError("Last name is required");
          return;
        }
        console.log("Registration payload:", {
          email,
          password1,
          password2,
          first_name: firstName,
          last_name: lastName,
        });
        // Send all fields to backend
        success = await register({
          email,
          password1,
          password2,
          first_name: firstName,
          last_name: lastName,
        });
        if (success) {
          navigate("/login");
          alert("Registration successful! Please login.");
        }
      }
    } catch (err) {
      let errorMsg = "Registration failed.";
      if (err.response && err.response.data) {
        console.log("Registration error details:", err.response.data);
        errorMsg = Object.values(err.response.data).flat().join(" ");
      }
      setError(errorMsg);
      console.error(err.response?.data || err.message);
    }
  };

  // Password reset handler
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetMsg("");
    setResetError("");
    try {
      await fetch("/api/auth/password/reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      setResetMsg("If your email exists, a reset link has been sent.");
    } catch (err) {
      setResetError("Failed to send reset email.");
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

        {/* Registration fields */}
        {method === "register" && (
          <>
            <input
              className="form-input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-lg"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
            />
            <input
              className="form-input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-lg"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
            />
            <input
              className="form-input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-lg"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              className="form-input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-lg"
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              placeholder="Password"
              required
            />
            <input
              className="form-input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-lg"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </>
        )}

        {/* Login fields */}
        {method === "login" && (
          <>
            <input
              className="form-input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-lg"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
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
          </>
        )}

        {method === "login" && (
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-indigo-600 hover:underline"
              onClick={() => setShowReset((v) => !v)}
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
          type="submit"
        >
          {name}
        </button>
      </form>
      {showReset && (
        <form
          onSubmit={handlePasswordReset}
          className="bg-white shadow-lg rounded-xl px-10 py-8 w-full max-w-md flex flex-col gap-4 mt-4"
        >
          <h2 className="text-xl font-bold text-center text-indigo-900 mb-2">
            Reset Password
          </h2>
          {resetMsg && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2 text-center border border-green-200">
              {resetMsg}
            </div>
          )}
          {resetError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center border border-red-200">
              {resetError}
            </div>
          )}
          <input
            className="form-input block w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-lg"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
            type="submit"
          >
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
};

AuthForm.propTypes = {
  method: PropTypes.oneOf(["login", "register"]).isRequired,
};

export default AuthForm;
