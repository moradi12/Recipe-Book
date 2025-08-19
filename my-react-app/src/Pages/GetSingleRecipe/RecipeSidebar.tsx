import React from 'react';
import { RecipeResponse } from '../../Models/RecipeResponse';

interface RecipeSidebarProps {
  recipe: RecipeResponse;
}

const RecipeSidebar: React.FC<RecipeSidebarProps> = ({ recipe }) => {
  
  return (
    <div className="recipe-sidebar">
      <div className="recipe-info-card">
        <h3 className="info-card-title">Recipe Details</h3>

        <div className="info-items">
          {/* Cooking Time */}
          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <div className="info-content">
              <div className="info-label">Cooking Time</div>
              <div className="info-value">{recipe.cookingTime} minutes</div>
            </div>
          </div>

          {/* Servings */}
          <div className="info-item">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <div className="info-content">
              <div className="info-label">Servings</div>
              <div className="info-value">{recipe.servings}</div>
            </div>
          </div>

          {/* Categories */}
          {recipe.categories && recipe.categories.length > 0 && (
            <div className="info-section">
              <div className="info-label">Categories</div>
              <div className="category-tags">
                {recipe.categories.map((category, index) => (
                  <span key={index} className="category-tag">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dietary Info */}
          {recipe.dietaryInfo && (
            <div className="info-section">
              <div className="info-label">Dietary Information</div>
              <div className="info-value">{recipe.dietaryInfo}</div>
            </div>
          )}

          {/* Gluten Free Badge */}
          {!recipe.containsGluten && (
            <div className="gluten-free-badge">
              <span>Gluten Free</span>
            </div>
          )}

          {/* Author */}
          {recipe.createdByUsername && (
            <div className="author-section">
              <div className="info-label">Created by</div>
              <div className="info-value">{recipe.createdByUsername}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSidebar;