import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteService from "../../../Service/FavoriteService";
import { notify } from "../../../Utiles/notif";
import recipeSystem from "../store";

// The backend returns an array of objects, each representing a favorite.
// If your new DTO is just { id, recipeId }, adjust accordingly.
interface FavoriteItem {
  id: number;
  recipe: {
    id: number;
    // any other fields if needed
  };
}

export function useFavorites() {
  const navigate = useNavigate();

  // The token from Redux store (null if logged out)
  const token = recipeSystem.getState().auth.token;

  // Keep track of the IDs of recipes the user has favorited
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>([]);

  // On mount, if the user is logged in, fetch their favorites
  useEffect(() => {
    if (!token) return; // Not logged in, so no favorites to fetch

    FavoriteService.getFavorites(token)
      .then((res: AxiosResponse<FavoriteItem[]>) => {
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
  const toggleFavorite = async (recipeId: number) => {
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
        // Update local state immediately
        setFavoriteRecipeIds((prev) => [...prev, recipeId]);
      } else {
        // Remove from favorites
        await FavoriteService.removeFavorite(token, recipeId);
        notify.success("Recipe removed from favorites!");
        setFavoriteRecipeIds((prev) => prev.filter((id) => id !== recipeId));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      let message = "Could not update favorites.";
      if (axios.isAxiosError(error) && error.response?.data) {
        message = String(error.response.data);
      }
      notify.error(message);
    }
  };

  return {
    favoriteRecipeIds,
    toggleFavorite,
  };
}
