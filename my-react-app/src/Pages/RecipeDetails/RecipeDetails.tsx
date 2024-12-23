import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RecipeResponse } from "../../Models/Recipe";
import { RecipeService } from "../../Service/RecipeService";

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (id) {
        try {
          const response = await RecipeService.getRecipeById(Number(id));
          setRecipe(response.data);
        } catch (error) {
          console.error("Failed to fetch recipe", error);
        }
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <p>Loading recipe...</p>;
  }

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <p>Ingredients: {recipe.ingredients.join(", ")}</p>
      <p>Cooking Time: {recipe.cookingTime} mins</p>
      <p>Servings: {recipe.servings}</p>
      <p>Dietary Info: {recipe.dietaryInfo || "N/A"}</p>
    </div>
  );
};

export default RecipeDetails;
