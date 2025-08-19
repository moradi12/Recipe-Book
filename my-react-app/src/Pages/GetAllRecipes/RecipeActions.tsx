import React, { useState } from 'react';
import { RecipeResponse } from '../../Models/RecipeResponse';

interface RecipeActionsProps {
  recipe: RecipeResponse;
  isFavorite: boolean;
  favoritesLoading: boolean;
  onToggleFavorite: (id: number) => void;
  onEditRecipe?: (id: number) => void;
  onApproveRecipe?: (id: number) => void;
  onRejectRecipe?: (id: number) => void;
  onDeleteRecipe?: (id: number) => Promise<void>;
  token: string | null;
  isApproved: boolean;
  onViewRecipe: () => void;
}

const RecipeActions: React.FC<RecipeActionsProps> = ({
  recipe,
  isFavorite,
  favoritesLoading,
  onToggleFavorite,
  onEditRecipe,
  onApproveRecipe,
  onRejectRecipe,
  onDeleteRecipe,
  token,
  isApproved,
  onViewRecipe
}) => {
  const [showAdminActions, setShowAdminActions] = useState(false);

  const handleApprove = () => {
    if (onApproveRecipe) {
      onApproveRecipe(recipe.id);
      setShowAdminActions(false);
    }
  };

  const hasAdminActions = onApproveRecipe || onRejectRecipe || onDeleteRecipe;

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

      {hasAdminActions && (
        <>
          {!showAdminActions ? (
            <button
              className="admin-toggle"
              onClick={() => setShowAdminActions(true)}
              title="Show admin actions"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"/>
                <circle cx="12" cy="5" r="3"/>
                <circle cx="12" cy="19" r="3"/>
              </svg>
              Admin
            </button>
          ) : (
            <div className="admin-actions">
              <button
                className="admin-toggle expanded"
                onClick={() => setShowAdminActions(false)}
                title="Hide admin actions"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="18,15 12,9 6,15"/>
                </svg>
                Less
              </button>

              {onApproveRecipe && (
                <button
                  className={`approve-button ${isApproved ? 'approved' : ''}`}
                  onClick={handleApprove}
                  disabled={isApproved}
                  title={isApproved ? "Already approved" : "Approve recipe"}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  {isApproved ? 'Approved' : 'Approve'}
                </button>
              )}

              {onRejectRecipe && (
                <button
                  className="reject-button"
                  onClick={() => onRejectRecipe(recipe.id)}
                  title="Reject recipe"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Reject
                </button>
              )}

              {onDeleteRecipe && (
                <button
                  className="delete-button"
                  onClick={() => onDeleteRecipe(recipe.id)}
                  title="Delete recipe"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  Delete
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecipeActions;