import React from 'react';

interface RecipeIngredientsProps {
  ingredients: string[];
}

const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({ ingredients }) => {
  
  // Handle different data types that might be received
  let ingredientsList: string[] = [];
  
  if (Array.isArray(ingredients)) {
    ingredientsList = ingredients.filter(Boolean); // Remove empty strings
  } else if (typeof ingredients === 'string') {
    // If it's a string, try to split by common delimiters
    ingredientsList = ingredients.split(/[,\n;]/).map(item => item.trim()).filter(Boolean);
  }
  
  return (
    <div className="recipe-section">
      <h2 className="section-title">Ingredients</h2>
      
      {ingredientsList.length > 0 ? (
        <ul className="ingredients-list">
          {ingredientsList.map((ingredient, index) => (
            <li key={index} className="ingredient-item">
              <span className="ingredient-bullet"></span>
              <span className="ingredient-text">{ingredient}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-data">
          <p>No ingredients available for this recipe.</p>
          <p><small>This recipe may not have been fully completed yet.</small></p>
        </div>
      )}
    </div>
  );
};

export default RecipeIngredients;