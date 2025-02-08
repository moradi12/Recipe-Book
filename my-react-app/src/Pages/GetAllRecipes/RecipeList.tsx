import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeResponse } from "../../Models/RecipeResponse";
import "./RecipeList.css";

import axios, { AxiosResponse } from "axios";
import FavoriteService from "../../Service/FavoriteService";
import { notify } from "../../Utiles/notif";
import recipeSystem from "../Redux/store";

interface FavoriteItem {
  id: number;             // The favorite entry's ID
  recipe: RecipeResponse; // The favorited recipe
}


interface RecipeListProps {
  recipes: RecipeResponse[];
  onEditRecipe?: (id: number) => void;    // Optional for admins only
  onApproveRecipe?: (id: number) => void; // For approving a recipe
  onRejectRecipe?: (id: number) => void;  // For rejecting a recipe
  onDeleteRecipe?: (id: number) => Promise<void>; // For deleting a recipe
}

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  onEditRecipe,
  onApproveRecipe,
  onRejectRecipe,
  onDeleteRecipe,
}) => {
  const navigate = useNavigate();

  const token = recipeSystem.getState().auth.token;

  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>([]);

  useEffect(() => {
    if (!token) return; // Not logged in, so no favorites to fetch

    FavoriteService.getFavorites(token)
      .then((res: AxiosResponse<FavoriteItem[]>) => {
        console.log("Fetched favorites:", res.data);
        // Convert each FavoriteItem to a recipe ID
        const favIds = res.data.map((fav) => fav.recipe.id);
        setFavoriteRecipeIds(favIds);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
      });
  }, [token]);

  /**
   * Toggle favorite status for a recipe
   */
  const handleToggleFavorite = async (recipeId: number) => {
    if (!token) {
      notify.error("You must be logged in to manage favorites!");
      navigate("/login");
      return;
    }

    const isFav = favoriteRecipeIds.includes(recipeId);

    try {
      if (!isFav) {
        // Add to favorites
        await FavoriteService.addFavorite(token, recipeId);
        notify.success("Recipe added to favorites!");
        setFavoriteRecipeIds((prev) => [...prev, recipeId]);
      } else {
        // Remove from favorites
        await FavoriteService.removeFavorite(token, recipeId);
        notify.success("Recipe removed from favorites!");
        setFavoriteRecipeIds((prev) => prev.filter((id) => id !== recipeId));
      }
    } catch (error: unknown) {
      console.error("Error toggling favorite:", error);

      // Safely extract an error message if Axios error
      let message = "Could not update favorites.";
      if (axios.isAxiosError(error) && error.response?.data) {
        message = String(error.response.data);
      }
      notify.error(message);
    }
  };

  if (!recipes.length) {
    return <p>No recipes found.</p>;
  }

  return (
    <ul className="recipe-list">
      {recipes.map((recipe) => {
        // Check if this recipe is currently favorited
        const isFav = favoriteRecipeIds.includes(recipe.id);

        return (
          <li key={recipe.id} className="recipe-item">
            <h3>{recipe.title || "No Title"}</h3>
            <p>
              <strong>Description:</strong>{" "}
              {recipe.description || "No Description"}
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
              <strong>Contains Gluten:</strong>{" "}
              {recipe.containsGluten ? "Yes" : "No"}
            </p>
            <p>
              <strong>Status:</strong> {recipe.status || "Unknown"}
            </p>
            <p>
              <strong>Categories:</strong>{" "}
              {recipe.categories && recipe.categories.length > 0
                ? recipe.categories.join(", ")
                : "Uncategorized"}
            </p>
            <p>
              <strong>Preparation Steps:</strong>{" "}
              {recipe.preparationSteps || "None"}
            </p>
            <p>
              <strong>Created By:</strong> {recipe.createdByUsername || "Unknown"}
            </p>
            {recipe.photo && (
              <div className="photo-preview">
                <img
                  src={`data:image/png;base64,${recipe.photo}`}
                  alt="Recipe"
                  className="preview-image"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}

            <h4>Ingredients:</h4>
            <ul>
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>

            {/* 
              Admin-related buttons 
              (only shown if the relevant props exist) 
            */}
            {onEditRecipe && (
              <button
                className="button button-primary"
                onClick={() => {
                  onEditRecipe(recipe.id);
                  navigate(`/edit-recipe/${recipe.id}`);
                }}
              >
                Edit
              </button>
            )}
            {onApproveRecipe && (
              <button
                className="button button-success"
                onClick={() => onApproveRecipe(recipe.id)}
              >
                Approve
              </button>
            )}
            {onRejectRecipe && (
              <button
                className="button button-warning"
                onClick={() => onRejectRecipe(recipe.id)}
              >
                Reject
              </button>
            )}
            {onDeleteRecipe && (
              <button
                className="button button-danger"
                onClick={() => onDeleteRecipe(recipe.id)}
              >
                Delete
              </button>
            )}

            {/* Always show "View" button */}
            <button
              className="button button-primary"
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            >
              View
            </button>

            {/* Show favorites toggle button ONLY if user is logged in (token) */}
            {token && (
              <button
                className="button button-favorite"
                onClick={() => handleToggleFavorite(recipe.id)}
              >
                {isFav ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default RecipeList;
