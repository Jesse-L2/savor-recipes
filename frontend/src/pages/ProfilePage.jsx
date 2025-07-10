import React, { useState, useEffect } from "react";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext"; // To get current user and refresh user data

const ProfilePage = () => {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    fetchUserData,
  } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    profile_picture: null, // For file input
    is_public: true,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({}); // For validation errors from backend
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Only fetch profile data if user is authenticated and user data is available
    if (isAuthenticated && user) {
      const fetchProfileData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.get("/users/profile/");
          const profileData = response.data;
          setFormData({
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            bio: profileData.bio || "",
            profile_picture: profileData.profile_picture || null, // URL for existing image
            is_public: profileData.is_public,
          });
        } catch (err) {
          console.error("Failed to fetch profile data:", err);
          setError("Failed to load profile data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchProfileData();
    } else if (!authLoading && !isAuthenticated) {
      // If not authenticated and auth check is done, stop loading
      setLoading(false);
    }
  }, [isAuthenticated, user, authLoading]); // Re-run when auth state or user changes

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear specific error for the field being changed
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setSuccessMessage(null); // Clear success message on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFormErrors({});
    setSuccessMessage(null);

    const dataToSend = new FormData();
    for (const key in formData) {
      // Only append if value is not null or empty string (unless it's a boolean)
      if (
        (formData[key] !== null && formData[key] !== "") ||
        typeof formData[key] === "boolean"
      ) {
        if (key === "profile_picture" && formData[key] instanceof File) {
          dataToSend.append(key, formData[key]);
        } else if (key === "profile_picture" && formData[key] === null) {
          // Explicitly send null if user wants to clear the image
          dataToSend.append(key, ""); // Send empty string to clear ImageField
        } else {
          dataToSend.append(key, formData[key]);
        }
      }
    }

    try {
      // Use PATCH for partial updates to allow sending only changed fields
      await api.patch("/users/profile/", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
      setSuccessMessage("Profile updated successfully!");
      // Refresh user data in AuthContext to reflect changes in Navbar etc.
      await fetchUserData();
    } catch (err) {
      console.error(
        "Profile update failed:",
        err.response?.data || err.message
      );
      if (err.response && err.response.data) {
        setFormErrors(err.response.data); // Set backend validation errors
        if (err.response.data.detail) {
          // General error message from DRF
          setError(err.response.data.detail);
        } else if (err.response.data.non_field_errors) {
          setError(err.response.data.non_field_errors[0]);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    // This case should ideally be handled by ProtectedRoute, but good for fallback
    return (
      <div className="text-center text-lg text-gray-600 mt-8">
        Please log in to view and manage your profile.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Your Profile
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-lg mb-8 max-w-2xl mx-auto">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="mb-5 text-center">
            <label
              htmlFor="profile_picture"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Profile Picture
            </label>
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gray-300">
              <img
                src={
                  (formData.profile_picture instanceof File
                    ? URL.createObjectURL(formData.profile_picture) // Preview new file
                    : formData.profile_picture) ||
                  "https://placehold.co/128x128/E0E0E0/6B7280?text=No+Pic"
                }
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/128x128/E0E0E0/6B7280?text=No+Pic";
                }}
              />
              {/* Button to clear image */}
              {formData.profile_picture && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, profile_picture: null })
                  }
                  className="absolute bottom-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition-colors"
                  title="Clear image"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h2a1 1 0 110 2H10a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2H10a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              )}
            </div>
            <input
              type="file"
              id="profile_picture"
              name="profile_picture"
              accept="image/*"
              onChange={handleChange}
              className={`w-full p-3 border ${
                formErrors.profile_picture
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark transition duration-200`}
            />
            {formErrors.profile_picture && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.profile_picture[0]}
              </p>
            )}
          </div>

          {/* First Name */}
          <div className="mb-5">
            <label
              htmlFor="first_name"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full p-3 border ${
                formErrors.first_name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200`}
              placeholder="John"
            />
            {formErrors.first_name && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.first_name[0]}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-5">
            <label
              htmlFor="last_name"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full p-3 border ${
                formErrors.last_name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200`}
              placeholder="Doe"
            />
            {formErrors.last_name && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.last_name[0]}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="mb-5">
            <label
              htmlFor="bio"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className={`w-full p-3 border ${
                formErrors.bio ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200`}
              placeholder="Tell us about yourself..."
            ></textarea>
            {formErrors.bio && (
              <p className="text-red-500 text-xs mt-1">{formErrors.bio[0]}</p>
            )}
          </div>

          {/* Is Public Profile */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="is_public"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <label htmlFor="is_public" className="ml-2 text-gray-700 text-sm">
              Make my profile public
            </label>
            {formErrors.is_public && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.is_public[0]}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200 shadow-md flex items-center justify-center"
            disabled={submitting}
          >
            {submitting ? (
              <svg
                className="animate-spin h-5 w-5 text-white mr-3"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
