import React, { useState } from 'react';
import RecipeService from '../../Service/RecipeService';
import { notify } from '../../Utiles/notif';
import { RecipeResponse } from '../../Models/RecipeResponse';

interface RecipeSelectorProps {
  onRecipeSelect: (recipe: RecipeResponse) => void;
}

const RecipeSelector: React.FC<RecipeSelectorProps> = ({ onRecipeSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<RecipeResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchRecipes = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setIsSearching(true);
      const response = await RecipeService.getMyRecipes();
      const filtered = response.data.filter((recipe: RecipeResponse) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching recipes:', error);
      notify.error('Failed to search recipes');
    } finally {
      setIsSearching(false);
    }
  };

  const selectRecipe = (recipe: RecipeResponse) => {
    onRecipeSelect(recipe);
    setSearchResults([]);
    setSearchTerm('');
  };

  return (
    <div className="recipe-selection">
      <h3>Find Your Recipe</h3>
      <div className="recipe-search">
        <input
          type="text"
          placeholder="Search your recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchRecipes()}
        />
        <button
          type="button"
          className="search-button"
          onClick={searchRecipes}
          disabled={isSearching}
        >
          {isSearching ? <div className="loading-spinner" /> : 'Search'}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="recipe-list">
          {searchResults.map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-item"
              onClick={() => selectRecipe(recipe)}
            >
              <div>
                <div className="recipe-name">{recipe.title}</div>
                <div className="recipe-meta">
                  {recipe.cookingTime} mins • {recipe.servings} servings
                </div>
              </div>
              <span style={{ color: '#667eea', fontWeight: '600' }}>Select →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeSelector;