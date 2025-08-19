import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeResponse } from "../../Models/RecipeResponse";
import RecipeService from "../../Service/RecipeService";
import { notify } from "../../Utiles/notif";
import RecipeHeader from "./RecipeHeader";
import RecipeIngredients from "./RecipeIngredients";
import RecipeInstructions from "./RecipeInstructions";
import RecipeSidebar from "./RecipeSidebar";
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="not-found">
        <p>Recipe not found.</p>
      </div>
    );
  }

  return (
    <div className="recipe-view">
      <div className="recipe-container">
        <button
          className="back-button"
          onClick={() => navigate("/all/recipes")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5m0 0l7 7m-7-7l7-7"/>
          </svg>
          Back to recipes
        </button>

        <div className="recipe-layout">
          <div className="recipe-main">
            <RecipeHeader recipe={recipe} />
            <RecipeIngredients ingredients={recipe.ingredients || []} />
            <RecipeInstructions instructions={recipe.preparationSteps || ""} />
          </div>

          <RecipeSidebar recipe={recipe} />
        </div>
      </div>
    </div>
  );
};

export default GetSingleRecipe;
