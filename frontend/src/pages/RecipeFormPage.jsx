import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";

const RecipeFormPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    main_image: null,
    ingredients: [{ item: "", quantity: "" }],
    instructions: [""],
    prep_time_minutes: "",
    cook_time_minutes: "",
    servings: "",
    difficulty: "Medium",
    tags: [], // Now only 'tags' to hold all selected tag IDs
    equipment_ids: [],
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [allTags, setAllTags] = useState([]); // Store all fetched tags (includes former categories)
  const [equipment, setEquipment] = useState([]);

  // State for search terms and visibility of suggestion lists
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const tagInputRef = useRef(null);

  const isEditMode = !!slug;

  // Consolidated useEffect for fetching all initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all combined tags and equipment
        const [tagsRes, equipmentRes] = await Promise.all([
          api.get("/recipes/tags/"), // Only fetching from /recipes/tags/ now
          api.get("/recipes/equipment/"),
        ]);

        setAllTags(Array.isArray(tagsRes.data) ? tagsRes.data : []);
        setEquipment(Array.isArray(equipmentRes.data) ? equipmentRes.data : []);

        if (isEditMode) {
          const recipeResponse = await api.get(`/recipes/recipes/${slug}/`);
          const recipeData = recipeResponse.data;

          if (!isAuthenticated || !user || recipeData.author.id !== user.id) {
            setError("You are not authorized to edit this recipe.");
            setLoading(false);
            return;
          }

          setFormData({
            title: recipeData.title,
            description: recipeData.description || "",
            main_image: recipeData.main_image,
            ingredients:
              Array.isArray(recipeData.ingredients) &&
              recipeData.ingredients.length > 0
                ? recipeData.ingredients.map((ing) => ({
                    item: ing.item || "",
                    quantity: ing.quantity || "",
                  }))
                : [{ item: "", quantity: "" }],
            instructions:
              Array.isArray(recipeData.instructions) &&
              recipeData.instructions.length > 0
                ? recipeData.instructions
                : [""],
            prep_time_minutes: recipeData.prep_time_minutes || "",
            cook_time_minutes: recipeData.cook_time_minutes || "",
            servings: recipeData.servings || "",
            difficulty: recipeData.difficulty,
            tags: Array.isArray(recipeData.tags)
              ? recipeData.tags.map((tag) => String(tag.id))
              : [], // Now only 'tags'
            equipment_ids: Array.isArray(recipeData.equipment)
              ? recipeData.equipment.map((eq) => String(eq.id))
              : [],
          });
        }
      } catch (err) {
        console.error(
          "Failed to load initial form data:",
          err.response?.data || err.message
        );
        setError(
          "Failed to load form data. Please ensure the backend is running and accessible."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [slug, isEditMode, isAuthenticated, user]);

  // Handle clicks outside to close suggestion lists
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagInputRef.current && !tagInputRef.current.contains(event.target)) {
        setShowTagSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      // Only used for equipment now
      const currentValues = Array.isArray(formData[name]) ? formData[name] : [];
      const itemValue = String(value);

      const newValue = checked
        ? [...currentValues, itemValue]
        : currentValues.filter((item) => item !== itemValue);
      setFormData({ ...formData, [name]: newValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleListChange = (index, key, value, fieldName) => {
    const list = [...formData[fieldName]];
    if (fieldName === "ingredients") {
      list[index] = { ...list[index], [key]: value };
    } else {
      list[index] = value;
    }
    setFormData({ ...formData, [fieldName]: list });
  };

  const addListItem = (fieldName) => {
    if (fieldName === "ingredients") {
      setFormData({
        ...formData,
        [fieldName]: [...formData[fieldName], { item: "", quantity: "" }],
      });
    } else {
      setFormData({ ...formData, [fieldName]: [...formData[fieldName], ""] });
    }
  };

  const removeListItem = (index, fieldName) => {
    const list = formData[fieldName].filter((_, i) => i !== index);
    if (fieldName === "ingredients") {
      setFormData({
        ...formData,
        [fieldName]: list.length > 0 ? list : [{ item: "", quantity: "" }],
      });
    } else {
      setFormData({ ...formData, [fieldName]: list.length > 0 ? list : [""] });
    }
  };

  // --- Functions for searchable Tags ---
  const handleTagSearchChange = (e) => {
    setTagSearchTerm(e.target.value);
    setShowTagSuggestions(true); // Show suggestions when typing
  };

  const handleSelectTag = (tag) => {
    const tagId = String(tag.id);
    if (!formData.tags.includes(tagId)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagId], // Add to 'tags' array
      }));
    }
    setTagSearchTerm(""); // Clear search term after selection
    setShowTagSuggestions(false); // Hide suggestions
  };

  const handleRemoveTag = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((id) => id !== tagId), // Remove from 'tags' array
    }));
  };

  // Filtered tags for suggestions
  const filteredTags = allTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase()) &&
      !formData.tags.includes(String(tag.id)) // Don't show already selected
  );
  // --- End of functions for searchable Tags ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFormErrors({});

    const dataToSend = new FormData();
    for (const key in formData) {
      if (key === "main_image" && formData[key] instanceof File) {
        dataToSend.append(key, formData[key]);
      } else if (Array.isArray(formData[key])) {
        if (["ingredients", "instructions"].includes(key)) {
          let filteredList;
          if (key === "ingredients") {
            filteredList = formData[key].filter(
              (ing) => ing.item.trim() !== ""
            );
          } else {
            filteredList = formData[key].filter((item) => item.trim() !== "");
          }
          dataToSend.append(key, JSON.stringify(filteredList));
        } else {
          // For 'tags' and 'equipment_ids', append each item
          formData[key].forEach((item) => dataToSend.append(key, item));
        }
      } else {
        dataToSend.append(key, formData[key]);
      }
    }

    try {
      if (isEditMode) {
        await api.patch(`/recipes/recipes/${slug}/`, dataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Recipe updated successfully!");
      } else {
        await api.post("/recipes/recipes/", dataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Recipe created successfully!");
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Submission failed:", err.response?.data || err.message);
      if (err.response && err.response.data) {
        setFormErrors(err.response.data);
        if (err.response.data.detail) {
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

  if (error && error !== "You are not authorized to edit this recipe.") {
    return <div className="text-red-500 text-center text-lg mt-8">{error}</div>;
  }

  if (isEditMode && error === "You are not authorized to edit this recipe.") {
    return (
      <div className="text-red-500 text-center text-lg mt-8">
        {error} You can only edit your own recipes.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        {isEditMode ? "Edit Recipe" : "Create New Recipe"}
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
        {error && !formErrors.detail && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-5">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Recipe Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-3 border ${
                formErrors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200`}
              placeholder="Delicious Pasta Carbonara"
              required
            />
            {formErrors.title && (
              <p className="text-red-500 text-xs mt-1">{formErrors.title[0]}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-5">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Short Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={`w-full p-3 border ${
                formErrors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200`}
              placeholder="A quick and easy weeknight meal..."
            ></textarea>
            {formErrors.description && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.description[0]}
              </p>
            )}
          </div>

          {/* Main Image */}
          <div className="mb-5">
            <label
              htmlFor="main_image"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Recipe Main Image
            </label>
            <input
              type="file"
              id="main_image"
              name="main_image"
              accept="image/*"
              onChange={handleChange}
              className={`w-full p-3 border ${
                formErrors.main_image ? "border-red-500" : "border-gray-300"
              } rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark transition duration-200`}
            />
            {formData.main_image && typeof formData.main_image === "string" && (
              <p className="text-sm text-gray-500 mt-2">
                Current image:{" "}
                <a
                  href={formData.main_image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Image
                </a>{" "}
                (Upload new to replace)
              </p>
            )}
            {formErrors.main_image && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.main_image[0]}
              </p>
            )}
          </div>

          {/* Ingredients */}
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Ingredients <span className="text-red-500">*</span>
            </label>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center mb-2 gap-2">
                <input
                  type="text"
                  value={ingredient.item}
                  onChange={(e) =>
                    handleListChange(
                      index,
                      "item",
                      e.target.value,
                      "ingredients"
                    )
                  }
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                  placeholder={`Ingredient ${index + 1} (e.g., Flour)`}
                  required
                />
                <input
                  type="text"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleListChange(
                      index,
                      "quantity",
                      e.target.value,
                      "ingredients"
                    )
                  }
                  className="w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                  placeholder="Quantity (e.g., 2 cups)"
                />
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index, "ingredients")}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5"
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
            ))}
            <button
              type="button"
              onClick={() => addListItem("ingredients")}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 mt-2"
            >
              Add Ingredient
            </button>
            {formErrors.ingredients && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.ingredients[0]}
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Instructions <span className="text-red-500">*</span>
            </label>
            {formData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-center mb-2">
                <textarea
                  value={instruction}
                  onChange={(e) =>
                    handleListChange(
                      index,
                      null,
                      e.target.value,
                      "instructions"
                    )
                  }
                  rows="2"
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 mr-2"
                  placeholder={`Step ${index + 1}`}
                  required
                ></textarea>
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeListItem(index, "instructions")}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5"
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
            ))}
            <button
              type="button"
              onClick={() => addListItem("instructions")}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 mt-2"
            >
              Add Step
            </button>
            {formErrors.instructions && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.instructions[0]}
              </p>
            )}
          </div>

          {/* Prep Time, Cook Time, Servings, Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <div>
              <label
                htmlFor="prep_time_minutes"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Prep Time (minutes)
              </label>
              <input
                type="number"
                id="prep_time_minutes"
                name="prep_time_minutes"
                value={formData.prep_time_minutes}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  formErrors.prep_time_minutes
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200`}
                placeholder="30"
                min="0"
              />
              {formErrors.prep_time_minutes && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.prep_time_minutes[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="cook_time_minutes"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Cook Time (minutes)
              </label>
              <input
                type="number"
                id="cook_time_minutes"
                name="cook_time_minutes"
                value={formData.cook_time_minutes}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  formErrors.cook_time_minutes
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200`}
                placeholder="45"
                min="0"
              />
              {formErrors.cook_time_minutes && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.cook_time_minutes[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="servings"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Servings
              </label>
              <input
                type="number"
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  formErrors.servings ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200`}
                placeholder="4"
                min="1"
              />
              {formErrors.servings && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.servings[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="difficulty"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className={`w-full p-3 border ${
                  formErrors.difficulty ? "border-red-500" : "border-gray-300"
                } rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200`}
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              {formErrors.difficulty && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.difficulty[0]}
                </p>
              )}
            </div>
          </div>

          {/* Tags - Searchable Select (Unified) */}
          <div className="mb-5">
            <label
              htmlFor="tag-search"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Tags
            </label>
            <div className="relative" ref={tagInputRef}>
              <input
                type="text"
                id="tag-search"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                placeholder="Search and add tags (e.g., Dinner, Vegan, Quick & Easy)..."
                value={tagSearchTerm}
                onChange={handleTagSearchChange}
                onFocus={() => setShowTagSuggestions(true)}
              />
              {showTagSuggestions && filteredTags.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {filteredTags.map((tag) => (
                    <li
                      key={tag.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                      onClick={() => handleSelectTag(tag)}
                    >
                      {tag.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Display selected tags as pills */}
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.tags.map((tagId) => {
                const tag = allTags.find((t) => String(t.id) === tagId);
                return tag ? (
                  <span
                    key={tagId}
                    className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-purple-200 transition-colors duration-200"
                    onClick={() => handleRemoveTag(tagId)}
                  >
                    {tag.name}
                    <svg
                      className="ml-1 w-3 h-3 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </span>
                ) : null;
              })}
            </div>
            {formErrors.tags && (
              <p className="text-red-500 text-xs mt-1">{formErrors.tags[0]}</p>
            )}
          </div>

          {/* Equipment - Checkboxes (unchanged) */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Equipment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {equipment.map((eq) => (
                <div key={eq.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`equipment-${eq.id}`}
                    name="equipment_ids"
                    value={String(eq.id)}
                    checked={formData.equipment_ids.includes(String(eq.id))}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label
                    htmlFor={`equipment-${eq.id}`}
                    className="ml-2 text-gray-700 text-sm"
                  >
                    {eq.name}
                  </label>
                </div>
              ))}
            </div>
            {formErrors.equipment_ids && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.equipment_ids[0]}
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
            ) : isEditMode ? (
              "Update Recipe"
            ) : (
              "Create Recipe"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipeFormPage;
