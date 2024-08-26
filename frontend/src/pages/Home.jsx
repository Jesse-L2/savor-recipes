import { useState, useEffect } from "react";
import api from "../api";
import Recipe from "../components/Recipe";

const Home = () => {
  const [recipes, setRecipes] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [servings, setServings] = useState("");
  const [image, setImage] = useState("");

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
      .post("/api/recipes/", {
        title: e.target.title.value,
        content: e.target.content.value,
        ingredients: e.target.ingredients.value,
        instructions: e.target.instructions.value,
        total_time: e.target.total_time.value,
        image: e.target.image.value,
        servings: e.target.servings.value,
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
      .delete(`/api/recipes/${id}/`)
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
        <label htmlFor="ingredients">Ingredients:</label>
        <br />
        <input
          type="text"
          id="ingredients"
          name="ingredients"
          onChange={(e) => setIngredients(e.target.value)}
          value={ingredients}
          required
        />
        <label htmlFor="instructions">Instructions:</label>
        <br />
        <textarea
          id="instructions"
          name="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          required
        ></textarea>
        <br />
        <label htmlFor="total_time">Total Time:</label>
        <br />
        <input
          type="text"
          id="total_time"
          name="total_time"
          onChange={(e) => setTotalTime(e.target.value)}
          value={totalTime}
          required
        />
        <label htmlFor="image">Image:</label>
        <br />
        <input
          type="file"
          id="image"
          name="image"
          onChange={(e) => setImage(e.target.value)}
          value={image}
        />
        <label htmlFor="servings">Servings:</label>
        <br />
        <input
          type="text"
          id="servings"
          name="servings"
          onChange={(e) => setServings(e.target.value)}
          value={servings}
          required
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Home;
