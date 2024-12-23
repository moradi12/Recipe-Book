import React, { useEffect, useState } from "react";
import { RecipeResponse } from "../../Models/Recipe";
import { RecipeService } from "../../Service/RecipeService";

const RecipeManagement: React.FC = () => {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);

  const fetchRecipes = async () => {
    try {
      const response = await RecipeService.getAllRecipes();
      setRecipes(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error fetching recipes!");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await RecipeService.deleteRecipe(id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error deleting recipe!");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div>
      <h2>Manage Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <button onClick={() => handleDelete(recipe.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeManagement;
