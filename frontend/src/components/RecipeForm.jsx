// frontend/src/components/RecipeForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    total_time: "",
    rating: 0,
    review_count: 0,
    servings: "",
    instructions: "",
  });
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      const fetchRecipe = async () => {
        try {
          const response = await api.get(`/api/recipes/${id}/`);
          setFormData({
            title: response.data.title,
            description: response.data.content || "",
            total_time: response.data.total_time || "",
            rating: response.data.rating || 0,
            review_count: response.data.review_count || 0,
            servings: response.data.servings || "",
            instructions: response.data.instructions || "",
          });
          // Parse ingredients and quantities from newline-separated strings
          const ingArr = (response.data.ingredients || "").split("\n");
          const qtyArr = (response.data.ingredient_quantities || "").split(
            "\n"
          );
          setIngredients(
            ingArr.map((name, idx) => ({ name, quantity: qtyArr[idx] || "" }))
          );
        } catch (err) {
          setError("Failed to load recipe");
          console.error("Error fetching recipe:", err);
        }
      };
      fetchRecipe();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleIngredientChange = (idx, field, value) => {
    setIngredients((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleAddIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", quantity: "" }]);
  };

  const handleRemoveIngredient = (idx) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    // Add regular fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "description") {
        data.append("content", value);
      } else {
        data.append(key, value);
      }
    });
    // Join ingredients and quantities as newline-separated strings
    data.append("ingredients", ingredients.map((i) => i.name).join("\n"));
    data.append(
      "ingredient_quantities",
      ingredients.map((i) => i.quantity).join("\n")
    );
    if (image) {
      data.append("images", image);
    }
    try {
      if (isEdit) {
        await api.put(`/api/recipes/${id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Set default values for rating and review_count on create
        data.set("rating", 0);
        data.set("review_count", 0);
        await api.post("/api/recipes/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save recipe");
      console.error("Error saving recipe:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Recipe" : "Add New Recipe"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
        encType="multipart/form-data"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Time
          </label>
          <input
            type="text"
            name="total_time"
            value={formData.total_time}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Servings
          </label>
          <input
            type="number"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingredients & Quantities
          </label>
          {ingredients.map((item, idx) => (
            <div key={idx} className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Ingredient"
                value={item.name}
                onChange={(e) =>
                  handleIngredientChange(idx, "name", e.target.value)
                }
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleIngredientChange(idx, "quantity", e.target.value)
                }
                className="w-32 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveIngredient(idx)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={ingredients.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddIngredient}
            className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Ingredient
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows="8"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEdit ? "Update" : "Create"} Recipe
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
