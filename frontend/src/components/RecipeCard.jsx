import React from "react";
import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  // Fallback image if main_image is not available
  const imageUrl = recipe.main_image
    ? recipe.main_image
    : "https://placehold.co/400x250/E0E0E0/6B7280?text=No+Image";

  // Ensure average_rating is treated as a number before calling toFixed()
  // Use parseFloat to convert string to number, default to 0 if null/undefined/invalid
  const displayRating = parseFloat(recipe.average_rating) || 0;

  return (
    <Link to={`/recipes/${recipe.slug}`} className="block">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        {/* Recipe Image */}
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src =
                "https://placehold.co/400x250/E0E0E0/6B7280?text=No+Image"; // Fallback
            }}
          />
          {/* Optional: Difficulty badge */}
          {recipe.difficulty && (
            <span
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white
              ${
                recipe.difficulty === "Easy"
                  ? "bg-green-500"
                  : recipe.difficulty === "Medium"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }
            `}
            >
              {recipe.difficulty}
            </span>
          )}
        </div>

        {/* Recipe Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 leading-tight">
            {recipe.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {recipe.description || "No description available."}
          </p>

          {/* Tags (formerly Categories and Tags) */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {recipe.tags.slice(0, 3).map(
                (
                  tag // Display up to 3 tags
                ) => (
                  <span
                    key={tag.id}
                    className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {tag.name}
                  </span>
                )
              )}
              {recipe.tags.length > 3 && (
                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  +{recipe.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Author and Ratings */}
          <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
            {recipe.author && (
              <span className="font-medium">
                By{" "}
                {recipe.author.first_name || recipe.author.email.split("@")[0]}
              </span>
            )}
            {displayRating !== undefined && (
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-yellow-400 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.532 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.777.565-1.832-.197-1.532-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.725c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
                <span>{displayRating.toFixed(1)}</span>
                {recipe.rating_count > 0 && (
                  <span className="ml-1">({recipe.rating_count})</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
