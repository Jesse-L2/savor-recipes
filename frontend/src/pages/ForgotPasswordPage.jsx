import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios directly for this specific request
import LoadingSpinner from "../components/LoadingSpinner";

// Get the backend root URL from environment variables
const BACKEND_ROOT_URL =
  import.meta.env.VITE_BACKEND_ROOT_URL || "http://localhost:8000";

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError(null);

    const csrftoken = getCookie("csrftoken"); // Get the CSRF token

    try {
      // Django's password_reset view expects a POST to /auth/password_reset/
      // We use axios directly with the full backend root URL to bypass the /api/ prefix
      await axios.post(
        `${BACKEND_ROOT_URL}/auth/password_reset/`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken, // Include the CSRF token in the headers
          },
          withCredentials: true, // Important: Allows sending cookies (including csrftoken) cross-origin
        }
      );
      setMessage(
        "If an account with that email exists, we've sent you instructions to reset your password. Please check your inbox and spam folder."
      );
      setEmail(""); // Clear email field
    } catch (err) {
      console.error(
        "Password reset request failed:",
        err.response?.data || err.message
      );
      // Django's password_reset view typically returns 200 OK even if email not found
      // to prevent email enumeration. So, we show a generic success message.
      // However, if there's a network error or other non-200 status, we can show an error.
      if (err.response && err.response.status >= 400) {
        setError(
          "Failed to send password reset email. Please check your email address and try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Forgot Your Password?
        </h2>

        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Enter your email address:
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 shadow-md flex items-center justify-center"
            disabled={submitting}
          >
            {submitting ? <LoadingSpinner /> : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          <Link
            to="/login"
            className="text-primary hover:underline font-semibold"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
