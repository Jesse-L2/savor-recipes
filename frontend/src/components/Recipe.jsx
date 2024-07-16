import React, { useContext, useEffect, useState } from "react";

const Recipe = ({ recipe, onDelete }) => {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

  return (
    <>
      <h2>Recipe</h2>
      <p>{recipe.title}</p>
      <p>{recipe.content}</p>
      <p>{formattedDate}</p>
      <button onClick={() => onDelete(recipe.id)}>Delete</button>
      {/* <ul>
        {recipe.map((recipe) => (
          <li key={recipe.id}>{recipe.title}</li>
          <li>{recipe.content}</li>
        ))}
      </ul> */}
    </>
  );
};

export default Recipe;
