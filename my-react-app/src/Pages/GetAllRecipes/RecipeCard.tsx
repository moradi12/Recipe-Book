import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeResponse } from '../../Models/RecipeResponse';
import RecipeActions from './RecipeActions';

interface RecipeCardProps {
  recipe: RecipeResponse;
  isFavorite: boolean;
  favoritesLoading: boolean;
  onToggleFavorite: (id: number) => void;
  onEditRecipe?: (id: number) => void;
  token: string | null;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  favoritesLoading,
  onToggleFavorite,
  onEditRecipe,
  token
}) => {
  const navigate = useNavigate();

  return (
    <li className="recipe-item">
      {/* Status Badge */}
      {recipe.status && recipe.status !== "approved" && (
        <div className={`status-badge ${recipe.status.toLowerCase()}`}>
          {recipe.status}
        </div>
      )}
      
      {/* Recipe Image */}
      <div className="photo-preview">
        {recipe.photo ? (
          <img
            className="preview-image"
            src={`data:image/png;base64,${recipe.photo}`}
            alt={recipe.title}
          />
        ) : (
          <div className="recipe-image-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>תמונת מתכון</span>
          </div>
        )}
      </div>
      
      {/* Content container */}
      <div className="recipe-item-content">
        <h3>{recipe.title || "No Title"}</h3>
        
        {recipe.description && (
          <p className="recipe-description">
            {recipe.description}
          </p>
        )}
        
        {/* Recipe Meta Information */}
        <div className="recipe-meta">
          <div className="meta-item">
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            <span><strong>{recipe.cookingTime}</strong> min</span>
          </div>
          <div className="meta-item">
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <span><strong>{recipe.servings}</strong> servings</span>
          </div>
          {recipe.createdByUsername && (
            <div className="meta-item">
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>By <strong>{recipe.createdByUsername}</strong></span>
            </div>
          )}
        </div>
        
        {/* Categories */}
        <div className="recipe-categories">
          {recipe.categories && recipe.categories.map((category, idx) => (
            <span key={idx} className="category-tag">
              {category}
            </span>
          ))}
          {recipe.dietaryInfo && (
            <span className="category-tag">
              {recipe.dietaryInfo}
            </span>
          )}
          {recipe.containsGluten === false && (
            <span className="category-tag">
              Gluten-Free
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <RecipeActions
        recipe={recipe}
        isFavorite={isFavorite}
        favoritesLoading={favoritesLoading}
        onToggleFavorite={onToggleFavorite}
        onEditRecipe={onEditRecipe}
        token={token}
        onViewRecipe={() => navigate(`/recipe/${recipe.id}`)}
      />
    </li>
  );
};

export default RecipeCard;