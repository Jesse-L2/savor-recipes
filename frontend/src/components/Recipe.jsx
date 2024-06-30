import React, { useContext, useEffect, useState } from "react";
import axios from "../axios";
import AuthContext from "../../context/AuthContext";

const Recipes = () => {
  const { authTokens } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("recipes/", {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      })
      .then((response) => {
        setRecipes(response.data);
      });
  }, [authTokens]);

  return (
    <div>
      <h2>Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>{recipe.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recipes;
