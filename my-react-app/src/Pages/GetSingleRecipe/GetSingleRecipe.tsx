import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeResponse } from "../../Models/RecipeResponse";
import RecipeService from "../../Service/RecipeService";
import { notify } from "../../Utiles/notif";

import "./GetSingleRecipe.css";

const GetSingleRecipe: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError("");
        if (!recipeId) {
          setError("Invalid recipe ID.");
          return;
        }
        const response = await RecipeService.getRecipeById(Number(recipeId));
        setRecipe(response.data);
      } catch (err: unknown) {
        let errorMessage = "Failed to load the recipe.";
        if (err instanceof Error) {
          errorMessage = err.message || errorMessage;
        }
        setError(errorMessage);
        notify.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="get-single-recipe">
      <h2>{recipe.title}</h2>
      <p><strong>Description:</strong> {recipe.description}</p>
      <p><strong>Ingredients:</strong> {recipe.ingredients?.join(", ")}</p>
      <p><strong>Categories:</strong> {recipe.categories?.join(", ")}</p>
      <button onClick={() => navigate("/recipes")}>Back to Recipes</button>
    </div>
  );
};

export default GetSingleRecipe;
