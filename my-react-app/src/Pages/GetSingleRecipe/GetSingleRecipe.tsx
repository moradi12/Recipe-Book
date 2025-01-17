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
      <div className="recipe-header">
        <h2>{recipe.title}</h2>
        {recipe.photo && (
          <img
            src={`data:image/png;base64,${recipe.photo}`}
            alt={recipe.title}
            className="recipe-photo"
          />
        )}
      </div>

      <div className="recipe-details">
        <p>
          <strong>Description:</strong> {recipe.description || "No description provided."}
        </p>
        <p>
          <strong>Ingredients:</strong>{" "}
          {recipe.ingredients?.length > 0 ? recipe.ingredients.join(", ") : "No ingredients listed."}
        </p>
        <p>
          <strong>Categories:</strong>{" "}
          {recipe.categories?.length > 0 ? recipe.categories.join(", ") : "Uncategorized"}
        </p>
        <p>
          <strong>Cooking Time:</strong> {recipe.cookingTime} minutes
        </p>
        <p>
          <strong>Servings:</strong> {recipe.servings}
        </p>
        <p>
          <strong>Dietary Info:</strong> {recipe.dietaryInfo || "N/A"}
        </p>
        <p>
          <strong>Contains Gluten:</strong> {recipe.containsGluten ? "Yes" : "No"}
        </p>
        <p>
          <strong>Status:</strong> {recipe.status || "Unknown"}
        </p>
        <p>
          <strong>Preparation Steps:</strong>{" "}
          {recipe.preparationSteps || "No preparation steps provided."}
        </p>
        <p>
          <strong>Created By:</strong> {recipe.createdByUsername || "Unknown"}
        </p>
      </div>

      <button className="back-button" onClick={() => navigate("/recipes")}>
        Back to Recipes
      </button>
    </div>
  );
};

export default GetSingleRecipe;
