import { useState, useEffect } from "react";
import api from "../api";
import Recipe from "../components/Recipe";

const Home = () => {
  const [recipes, setRecipes] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = () => {
    api
      .get("/api/recipes/")
      .then((res) => {
        setRecipes(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createRecipe = (e) => {
    e.preventDefault();
    api
      .post("/api/recipe/", {
        title: e.target.title.value,
        content: e.target.content.value,
      })
      .then((response) => {
        if (response.status === 201) alert("Recipe created");
        else alert("Failed to create recipe");
        getRecipes();
      })
      .catch((err) => alert(err));
  };

  const deleteRecipe = (id) => {
    api
      .delete(`/api/recipe/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Recipe deleted");
        else alert("Failed to delete recipe");
        getRecipes();
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <h2>Recipes</h2>
      <div>
        {/* {recipes.map((recipe) => (
          <Recipe recipe={recipe} onDelete={deleteRecipe} key={recipe.id} />
        ))} */}
      </div>
      <h2>Add a Recipe</h2>
      <form onSubmit={createRecipe}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
        <label htmlFor="content">Content:</label>
        <br />
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <br />
        <input type="submit" value="Submit"></input>
      </form>
    </div>
  );
};

export default Home;
