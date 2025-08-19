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
        let currentFavoriteIds = favoriteRecipeIds;
        try {
          await fetchFavorites();
          // After fetchFavorites, we need to get the updated favoriteRecipeIds
          // We'll use a separate effect to handle this
        } catch (error) {
          console.log('Continuing with existing favorite IDs after fetch error');
        }
      } catch (error) {
        console.error('Error loading favorite recipes:', error);
        notify.error('Failed to load favorite recipes');
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteRecipes();
  }, [requireAuth, fetchFavorites]);

  // Separate effect to handle recipe details fetching when favoriteRecipeIds changes
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (favoriteRecipeIds.length > 0) {
        setLoading(true);
        try {
          const recipePromises = favoriteRecipeIds.map(async (recipeId) => {
            try {
              const response = await RecipeService.getRecipeById(recipeId);
              return response.data;
            } catch (error) {
              // Check if it's a network error (backend not running)
              if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_NETWORK') {
                console.warn(`Backend server offline - cannot fetch recipe ${recipeId}`);
                // Create a placeholder recipe object for offline mode
                return {
                  id: recipeId,
                  title: `Recipe #${recipeId}`,
                  description: 'Recipe details are currently unavailable due to server connection issues. Click "View Recipe" to see if the full recipe can be loaded.',
                  photo: '/api/placeholder/350/200', // Placeholder image
                  cookingTime: null,
                  servings: null,
                  containsGluten: undefined,
                  dietaryInfo: 'Server offline - dietary info unavailable',
                  ingredients: [],
                  instructions: [],
                  category: { id: 0, name: 'Unknown' },
                  status: 'APPROVED',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  user: null,
                  offline: true // Flag to indicate this is offline data
                } as RecipeResponse & { offline?: boolean };
              }
              console.error(`Error fetching recipe ${recipeId}:`, error);
              return null;
            }
          });

          const recipes = await Promise.all(recipePromises);
          const validRecipes = recipes.filter((recipe): recipe is RecipeResponse => recipe !== null);
          setFavoriteRecipes(validRecipes);
          
          // If all recipes failed to load due to network issues, show a helpful message
          const offlineRecipes = validRecipes.filter((recipe: any) => recipe.offline);
          if (offlineRecipes.length > 0 && offlineRecipes.length === validRecipes.length) {
            notify.warning('Backend server is offline. Recipe details are limited.');
          }
        } catch (error) {
          console.error('Error fetching recipe details:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setFavoriteRecipes([]);
      }
    };

    fetchRecipeDetails();
  }, [favoriteRecipeIds]);

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
            <div key={recipe.id} className={`favorite-recipe-card ${(recipe as any).offline ? 'offline-recipe' : ''}`}>
              <div className="recipe-header">
                <h3>
                  {recipe.title}
                  {(recipe as any).offline && <span className="offline-indicator"> 🔌</span>}
                </h3>
                <button
                  className="remove-favorite-btn"
                  onClick={() => handleRemoveFavorite(recipe.id)}
                  disabled={favoritesLoading}
                  title="Remove from favorites"
                >
                  {favoritesLoading ? '⏳' : '💔'}
                </button>
              </div>

              <div className="recipe-image">
                {recipe.photo && !(recipe as any).offline ? (
                  <img src={recipe.photo} alt={recipe.title} />
                ) : (
                  <div className="placeholder-image">
                    <div className="placeholder-content">
                      <span className="recipe-id">#{recipe.id}</span>
                      <span className="placeholder-text">
                        {(recipe as any).offline ? 'Recipe Image Unavailable' : 'No Image'}
                      </span>
                      {(recipe as any).offline && <span className="offline-badge">🔌 Offline</span>}
                    </div>
                  </div>
                )}
              </div>

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
                  title={`View full details for Recipe #${recipe.id}`}
                >
                  <span className="btn-icon">👁️</span>
                  View Recipe
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={() => handleEditRecipe(recipe.id)}
                  title={`Edit Recipe #${recipe.id}`}
                  disabled={(recipe as any).offline}
                >
                  <span className="btn-icon">✏️</span>
                  {(recipe as any).offline ? 'Edit (Offline)' : 'Edit Recipe'}
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