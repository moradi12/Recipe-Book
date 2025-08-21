import React from "react";
import { RecipeResponse } from "../../Models/RecipeResponse";
import recipeSystem from "../Redux/store";
import { useFavorites } from "../../hooks/useFavorites";
import RecipeCard from "./RecipeCard";

interface RecipeListProps {
  recipes: RecipeResponse[];
  onEditRecipe?: (id: number) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  onEditRecipe,
}) => {
  const token = recipeSystem.getState().auth.token;
  const { favoriteRecipeIds, toggleFavorite, loading: favoritesLoading } = useFavorites();

  if (!recipes.length) {
    return (
      <div className="no-recipes">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <h3>No recipes found</h3>
        <p>Try adjusting your search criteria or filters to find more recipes.</p>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favoriteRecipeIds.includes(recipe.id)}
          favoritesLoading={favoritesLoading}
          onToggleFavorite={toggleFavorite}
          onEditRecipe={onEditRecipe}
          token={token}
        />
      ))}
    </div>
  );
};

export default RecipeList;
