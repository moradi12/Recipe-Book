import React, { memo } from 'react';
import { RecipeResponse } from '../../Models/RecipeResponse';

interface RecipeActionsProps {
  recipe: RecipeResponse;
  isFavorite: boolean;
  favoritesLoading: boolean;
  onToggleFavorite: (id: number) => void;
  onEditRecipe?: (id: number) => void;
  token: string | null;
  onViewRecipe: () => void;
}

const RecipeActions: React.FC<RecipeActionsProps> = memo(({
  recipe,
  isFavorite,
  favoritesLoading,
  onToggleFavorite,
  onEditRecipe,
  token,
  onViewRecipe
}) => {

  return (
    <div className="recipe-actions">
      <button className="view-button" onClick={onViewRecipe}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        View Recipe
      </button>

      {token && (
        <button
          className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
          onClick={() => onToggleFavorite(recipe.id)}
          disabled={favoritesLoading}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {favoritesLoading ? 'Updating...' : (isFavorite ? 'Favorited' : 'Favorite')}
        </button>
      )}

      {onEditRecipe && (
        <button
          className="edit-button"
          onClick={() => onEditRecipe(recipe.id)}
          title="Edit recipe"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      )}

    </div>
  );
});

export default RecipeActions;