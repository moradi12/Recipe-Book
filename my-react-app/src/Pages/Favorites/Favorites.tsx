import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { useAuth } from '../../hooks/useAuth';
import { RecipeResponse } from '../../Models/RecipeResponse';
import RecipeService from '../../Service/RecipeService';
import { notify } from '../../Utiles/notif';
import './Favorites.css';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { 
    favoriteRecipeIds, 
    toggleFavorite, 
    loading: favoritesLoading,
    fetchFavorites 
  } = useFavorites();

  const [favoriteRecipes, setFavoriteRecipes] = useState<RecipeResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth()) {
      return;
    }

    const loadFavoriteRecipes = async () => {
      try {
        setLoading(true);
        
        // First ensure favorites are loaded
        try {
          await fetchFavorites();
        } catch (error) {
          // If fetchFavorites fails, we'll continue with whatever favoriteRecipeIds we have
          console.log('Continuing with existing favorite IDs after fetch error');
        }
        
        // If we have favorite recipe IDs, fetch the full recipe details
        if (favoriteRecipeIds.length > 0) {
          const recipePromises = favoriteRecipeIds.map(async (recipeId) => {
            try {
              const response = await RecipeService.getRecipeById(recipeId);
              return response.data;
            } catch (error) {
              console.error(`Error fetching recipe ${recipeId}:`, error);
              return null;
            }
          });

          const recipes = await Promise.all(recipePromises);
          const validRecipes = recipes.filter((recipe): recipe is RecipeResponse => recipe !== null);
          setFavoriteRecipes(validRecipes);
        } else {
          setFavoriteRecipes([]);
        }
      } catch (error) {
        console.error('Error loading favorite recipes:', error);
        notify.error('Failed to load favorite recipes');
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteRecipes();
  }, [requireAuth, fetchFavorites, favoriteRecipeIds]);

  const handleRemoveFavorite = async (recipeId: number) => {
    await toggleFavorite(recipeId);
    // Remove from local state immediately for better UX
    setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
  };

  const handleViewRecipe = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleEditRecipe = (recipeId: number) => {
    navigate(`/edit-recipe/${recipeId}`);
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your favorite recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>My Favorite Recipes</h1>
        <p className="favorites-subtitle">
          {favoriteRecipes.length} recipe{favoriteRecipes.length !== 1 ? 's' : ''} in your favorites
        </p>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon">💔</div>
          <h2>No favorite recipes yet</h2>
          <p>Start exploring recipes and add your favorites by clicking the heart icon!</p>
          <button 
            className="explore-btn" 
            onClick={() => navigate('/all-recipes')}
          >
            Explore Recipes
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favoriteRecipes.map((recipe) => (
            <div key={recipe.id} className="favorite-recipe-card">
              <div className="recipe-header">
                <h3>{recipe.title}</h3>
                <button
                  className="remove-favorite-btn"
                  onClick={() => handleRemoveFavorite(recipe.id)}
                  disabled={favoritesLoading}
                  title="Remove from favorites"
                >
                  {favoritesLoading ? '⏳' : '💔'}
                </button>
              </div>

              {recipe.photo && (
                <div className="recipe-image">
                  <img src={recipe.photo} alt={recipe.title} />
                </div>
              )}

              <div className="recipe-content">
                <p className="recipe-description">{recipe.description}</p>

                <div className="recipe-meta">
                  {recipe.cookingTime && (
                    <span className="meta-item">
                      🕒 {recipe.cookingTime} min
                    </span>
                  )}
                  {recipe.servings && (
                    <span className="meta-item">
                      👥 {recipe.servings} servings
                    </span>
                  )}
                  {recipe.containsGluten !== undefined && (
                    <span className={`meta-item ${recipe.containsGluten ? 'contains-gluten' : 'gluten-free'}`}>
                      {recipe.containsGluten ? '🌾 Contains Gluten' : '🚫 Gluten Free'}
                    </span>
                  )}
                </div>

                {recipe.dietaryInfo && (
                  <div className="dietary-info">
                    <strong>Dietary Info:</strong> {recipe.dietaryInfo}
                  </div>
                )}
              </div>

              <div className="recipe-actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => handleViewRecipe(recipe.id)}
                >
                  View Recipe
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={() => handleEditRecipe(recipe.id)}
                >
                  Edit Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="favorites-actions">
        <button 
          className="back-btn" 
          onClick={() => navigate('/user-panel')}
        >
          ← Back to Profile
        </button>
        <button 
          className="explore-more-btn" 
          onClick={() => navigate('/all-recipes')}
        >
          Explore More Recipes
        </button>
      </div>
    </div>
  );
};

export default Favorites;