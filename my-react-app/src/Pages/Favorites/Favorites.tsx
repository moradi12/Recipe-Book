import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import { RecipeResponse } from '../../Models/RecipeResponse';
import RecipeService from '../../Service/RecipeService';
import './Favorites.css';

// Loading skeleton component for better UX
const RecipeSkeleton: React.FC = () => (
  <div className="favorite-recipe-card skeleton">
    <div className="recipe-header">
      <div className="skeleton-title"></div>
      <div className="skeleton-button"></div>
    </div>
    <div className="skeleton-image"></div>
    <div className="recipe-content">
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
      <div className="recipe-meta">
        <div className="skeleton-meta"></div>
        <div className="skeleton-meta"></div>
      </div>
    </div>
    <div className="recipe-actions">
      <div className="skeleton-button"></div>
      <div className="skeleton-button"></div>
    </div>
  </div>
);

// Error retry component
const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="error-state">
    <div className="error-icon">⚠️</div>
    <h3>Something went wrong</h3>
    <p>{error}</p>
    <button className="retry-btn" onClick={onRetry}>
      Try Again
    </button>
  </div>
);

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { 
    favoriteRecipeIds, 
    loading: favoritesLoading,
    error: favoritesError,
    removeFavorite 
  } = useFavorites();

  const [favoriteRecipes, setFavoriteRecipes] = useState<RecipeResponse[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [recipesError, setRecipesError] = useState<string | null>(null);
  
  // Memoized loading state
  const loading = useMemo(() => {
    return favoritesLoading || recipesLoading;
  }, [favoritesLoading, recipesLoading]);
  
  // Memoized error state
  const error = useMemo(() => {
    return favoritesError || recipesError;
  }, [favoritesError, recipesError]);

  // Auth check effect
  useEffect(() => {
    if (!requireAuth()) {
      return;
    }
  }, [requireAuth]);

  // Optimized recipe details fetching with better error handling
  const fetchRecipeDetails = useCallback(async (recipeIds: number[]) => {
    if (recipeIds.length === 0) {
      setFavoriteRecipes([]);
      return;
    }

    try {
      setRecipesLoading(true);
      setRecipesError(null);
      
      const recipePromises = recipeIds.map(async (recipeId) => {
        try {
          const response = await RecipeService.getRecipeById(recipeId);
          return { success: true, data: response.data };
        } catch (error: any) {
          const isNetworkError = error?.code === 'ERR_NETWORK';
          
          if (isNetworkError) {
            // Create a placeholder for offline mode
            return {
              success: true,
              data: {
                id: recipeId,
                title: `Recipe #${recipeId}`,
                description: 'Recipe details unavailable - server offline. Click "View Recipe" to try loading full details.',
                photo: null,
                cookingTime: null,
                servings: null,
                containsGluten: undefined,
                dietaryInfo: 'Server offline - info unavailable',
                ingredients: [],
                instructions: [],
                category: { id: 0, name: 'Unknown' },
                status: 'APPROVED',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                user: null,
                offline: true
              } as RecipeResponse & { offline?: boolean }
            };
          }
          
          console.error(`Error fetching recipe ${recipeId}:`, error);
          return { success: false, error: error.message };
        }
      });

      const results = await Promise.all(recipePromises);
      const validRecipes = results
        .filter((result): result is { success: true; data: RecipeResponse } => result.success)
        .map(result => result.data);
      
      const failedCount = results.filter(result => !result.success).length;
      
      setFavoriteRecipes(validRecipes);
      
      // Show appropriate notifications
      const offlineCount = validRecipes.filter((recipe: any) => recipe.offline).length;
      if (offlineCount > 0) {
        setRecipesError(`${offlineCount} recipe${offlineCount > 1 ? 's' : ''} loaded in offline mode`);
      } else if (failedCount > 0) {
        setRecipesError(`Failed to load ${failedCount} recipe${failedCount > 1 ? 's' : ''}`);
      }
      
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      setRecipesError('Failed to load recipe details');
    } finally {
      setRecipesLoading(false);
    }
  }, []);

  // Effect to fetch recipe details when favoriteRecipeIds changes
  useEffect(() => {
    fetchRecipeDetails(favoriteRecipeIds);
  }, [favoriteRecipeIds, fetchRecipeDetails]);

  // Handle remove favorite with optimistic update
  const handleRemoveFavorite = useCallback(async (recipeId: number) => {
    // Optimistic update
    setFavoriteRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    
    try {
      await removeFavorite(recipeId);
    } catch (error) {
      // Revert optimistic update on failure
      fetchRecipeDetails(favoriteRecipeIds);
    }
  }, [removeFavorite, favoriteRecipeIds, fetchRecipeDetails]);

  const handleViewRecipe = useCallback((recipeId: number) => {
    navigate(`/recipe/${recipeId}`);
  }, [navigate]);

  const handleEditRecipe = useCallback((recipeId: number) => {
    navigate(`/edit-recipe/${recipeId}`);
  }, [navigate]);
  
  const handleRetry = useCallback(() => {
    setRecipesError(null);
    console.log('Retry disabled - will rebuild from scratch');
  }, []);

  // Show error state if there's an unrecoverable error
  if (error && !loading && favoriteRecipes.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-header">
          <h1>My Favorite Recipes</h1>
        </div>
        <ErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>My Favorite Recipes</h1>
        {/* Show warning if there are errors but recipes still loaded */}
        {error && favoriteRecipes.length > 0 && (
          <div className="warning-banner">
            <span className="warning-icon">⚠️</span>
            {error}
          </div>
        )}
        <p className="favorites-subtitle">
          {loading ? 'Loading...' : (
            `${favoriteRecipes.length} recipe${favoriteRecipes.length !== 1 ? 's' : ''} in your favorites`
          )}
        </p>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="favorites-grid">
          {Array.from({ length: Math.min(6, Math.max(favoriteRecipeIds.length, 3)) }).map((_, index) => (
            <RecipeSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && favoriteRecipes.length === 0 && !error && (
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
      )}

      {/* Recipe grid */}
      {!loading && favoriteRecipes.length > 0 && (
        <div className="favorites-grid">
          {favoriteRecipes.map((recipe) => {
            const isOffline = (recipe as any).offline;
            return (
              <div key={recipe.id} className={`favorite-recipe-card ${isOffline ? 'offline-recipe' : ''}`}>
                <div className="recipe-header">
                  <h3>
                    {recipe.title}
                    {isOffline && <span className="offline-indicator"> 🔌</span>}
                  </h3>
                  <button
                    className="remove-favorite-btn"
                    onClick={() => handleRemoveFavorite(recipe.id)}
                    disabled={favoritesLoading}
                    title="Remove from favorites"
                    aria-label="Remove from favorites"
                  >
                    {favoritesLoading ? '⏳' : '💔'}
                  </button>
                </div>

                <div className="recipe-image">
                  {recipe.photo && !isOffline ? (
                    <img 
                      src={recipe.photo} 
                      alt={recipe.title}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`placeholder-image ${recipe.photo && !isOffline ? 'hidden' : ''}`}>
                    <div className="placeholder-content">
                      <span className="recipe-id">#{recipe.id}</span>
                      <span className="placeholder-text">
                        {isOffline ? 'Recipe Image Unavailable' : 'No Image'}
                      </span>
                      {isOffline && <span className="offline-badge">🔌 Offline</span>}
                    </div>
                  </div>
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
                    aria-label={`View Recipe #${recipe.id}`}
                  >
                    <span className="btn-icon">👁️</span>
                    View Recipe
                  </button>
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEditRecipe(recipe.id)}
                    title={`Edit Recipe #${recipe.id}`}
                    aria-label={`Edit Recipe #${recipe.id}`}
                    disabled={isOffline}
                  >
                    <span className="btn-icon">✏️</span>
                    {isOffline ? 'Edit (Offline)' : 'Edit Recipe'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer actions */}
      {!loading && (
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
          {error && (
            <button 
              className="retry-btn" 
              onClick={handleRetry}
              title="Retry loading recipes"
            >
              🔄 Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Favorites;