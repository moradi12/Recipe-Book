import React from 'react';
import { RecipeResponse } from '../../Models/RecipeResponse';

interface RecipeHeaderProps {
  recipe: RecipeResponse;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ recipe }) => {
  return (
    <div className="recipe-header">
      <h1 className="recipe-title">{recipe.title}</h1>
      {recipe.description && (
        <p className="recipe-description">{recipe.description}</p>
      )}
      
      {recipe.photo ? (
        <div className="recipe-image">
          <img
            src={`data:image/png;base64,${recipe.photo}`}
            alt={recipe.title}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="recipe-image recipe-image-placeholder">
          <div className="image-placeholder-content">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <h3>Recipe Image</h3>
            <p>No image available for this recipe</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeHeader;