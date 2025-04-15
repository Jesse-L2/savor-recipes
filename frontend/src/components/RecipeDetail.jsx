import React, { useContext, useEffect, useState } from "react";

const RecipeDetail = ({ recipe, onDelete }) => {
  const formattedDate = new Date(recipe.created_at).toLocaleDateString("en-US");

  return (
    <div className="recipe-container">
      <h2>Recipe</h2>
      <p className="recipe-title">{recipe.title}</p>
      <p>{recipe.content}</p>
      <p>{formattedDate}</p>
      <button onClick={() => onDelete(recipe.id)}>Delete</button>
    </div>
  );
};

export default RecipeDetail;
