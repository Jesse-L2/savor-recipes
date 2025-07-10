import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api"; // Use your configured API instance
import LoadingSpinner from "../components/LoadingSpinner";

const ResetPasswordConfirmPage = () => {
  const { uidb64, token } = useParams(); // Get uidb64 and token from URL parameters
  const navigate = useNavigate();

  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validLink, setValidLink] = useState(true); // State to check if link is valid

  // Optional: Verify link validity on component mount (can be done by attempting a dummy request)
  // Django's password_reset_confirm view handles validity check on POST,
  // so a separate GET check isn't strictly necessary for basic functionality.
  // We'll rely on the POST response to determine validity.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError(null);

    if (newPassword1 !== newPassword2) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    try {
      // Django's password_reset_confirm view expects a POST to /auth/reset/confirm/
      // with uid, token, new_password1, new_password2
      await api.post("/auth/reset/confirm/", {
        uid: uidb64,
        token: token,
        new_password1: newPassword1,
        new_password2: newPassword2,
      });
      setMessage(
        "Your password has been reset successfully! You can now log in with your new password."
      );
      setNewPassword1("");
      setNewPassword2("");
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error(
        "Password reset confirmation failed:",
        err.response?.data || err.message
      );
      if (err.response && err.response.data) {
        if (err.response.data.uid || err.response.data.token) {
          setError(
            "The reset link is invalid or has expired. Please request a new one."
          );
          setValidLink(false); // Mark link as invalid
        } else if (err.response.data.new_password1) {
          setError(`New password error: ${err.response.data.new_password1[0]}`);
        } else if (err.response.data.new_password2) {
          setError(
            `Confirm password error: ${err.response.data.new_password2[0]}`
          );
        } else {
          setError(
            "An unexpected error occurred during password reset. Please try again."
          );
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!validLink) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-6">Invalid Link</h2>
          <p className="text-gray-700 mb-6">
            The password reset link is invalid or has expired. Please request a
            new password reset.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 shadow-md"
          >
            Request New Password Reset
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Set New Password
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
              htmlFor="new_password1"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="new_password1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
              placeholder="Enter your new password"
              value={newPassword1}
              onChange={(e) => setNewPassword1(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="new_password2"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="new_password2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
              placeholder="Confirm your new password"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 shadow-md flex items-center justify-center"
            disabled={submitting}
          >
            {submitting ? <LoadingSpinner /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmPage;
