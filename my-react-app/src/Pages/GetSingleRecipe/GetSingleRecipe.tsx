import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RecipeResponse } from "../../Models/RecipeResponse";
import RecipeService from "../../Service/RecipeService";
import { notify } from "../../Utiles/notif";
import { useAuth } from "../../hooks/useAuth";
import { useFavorites } from "../../hooks/useFavorites";
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
  
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite, loading: favoritesLoading } = useFavorites();

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!recipe) return;
    await toggleFavorite(recipe.id);
  };

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
        <div className="recipe-actions-header">
          <button
            className="back-button"
            onClick={() => navigate("/all/recipes")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5m0 0l7 7m-7-7l7-7"/>
            </svg>
            Back to recipes
          </button>

          {isAuthenticated && recipe && (
            <button
              className={`favorite-button ${isFavorite(recipe.id) ? 'favorited' : ''}`}
              onClick={handleFavoriteToggle}
              disabled={favoritesLoading}
              title={isFavorite(recipe.id) ? "Remove from favorites" : "Add to favorites"}
            >
              <svg viewBox="0 0 24 24" fill={isFavorite(recipe.id) ? "currentColor" : "none"} stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {favoritesLoading ? 'Updating...' : (isFavorite(recipe.id) ? 'Favorited' : 'Favorite')}
            </button>
          )}

        </div>

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
