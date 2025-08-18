import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Favorite } from '../Models/Favorite';
import FavoriteService from '../Service/FavoriteService';
import { useAuth } from './useAuth';
import { notify } from '../Utiles/notif';

export interface FavoritesHookReturn {
  // Data
  favorites: Favorite[];
  favoriteRecipeIds: number[];
  
  // Loading states
  loading: boolean;
  
  // Operations
  fetchFavorites: () => Promise<void>;
  addFavorite: (recipeId: number) => Promise<boolean>;
  removeFavorite: (recipeId: number) => Promise<boolean>;
  toggleFavorite: (recipeId: number) => Promise<void>;
  isFavorite: (recipeId: number) => boolean;
}

export function useFavorites(): FavoritesHookReturn {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>([]);
  
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth } = useAuth();

  // Loading states
  const [fetchLoading, setFetchLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  
  const loading = fetchLoading || addLoading || removeLoading;

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoriteRecipeIds([]);
      return;
    }

    try {
      setFetchLoading(true);
      const response = await FavoriteService.getFavorites();
      
      const data = response.data;
      setFavorites(data);
      // Extract recipe IDs for quick lookup
      const recipeIds = data.map((fav: Favorite) => {
        // Handle different possible response structures
        if (typeof fav.recipe === 'object' && fav.recipe?.id) {
          return fav.recipe.id;
        } else if (fav.recipeId) {
          return fav.recipeId;
        } else if (typeof fav.recipe === 'number') {
          return fav.recipe;
        }
        return fav.id; // fallback
      });
      setFavoriteRecipeIds(recipeIds);
    } catch (error) {
      // Check if it's a network error (backend not running) or connection aborted
      if (error && typeof error === 'object' && 'code' in error && 
          (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED')) {
        console.warn('Backend server appears to be offline or unreachable. Using local storage fallback.');
        // Try to load from localStorage as fallback
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          try {
            const favoriteIds = JSON.parse(savedFavorites) as number[];
            setFavoriteRecipeIds(favoriteIds);
            console.log('Loaded favorites from localStorage:', favoriteIds);
            return;
          } catch (parseError) {
            console.error('Error parsing saved favorites:', parseError);
          }
        }
        setFavoriteRecipeIds([]);
        // Only show warning once, not as an error
        console.warn('Using offline mode for favorites. Start the backend server for full functionality.');
      } else {
        console.error('Error fetching favorites:', error);
        notify.error('Failed to fetch favorites');
      }
    } finally {
      setFetchLoading(false);
    }
  }, [isAuthenticated]);

  // Execute add favorite API call
  const executeAddFavorite = useCallback(async (recipeId: number): Promise<boolean> => {
    try {
      setAddLoading(true);
      await FavoriteService.addFavorite(recipeId);
      notify.success('Recipe added to favorites!');
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      
      // Fallback to localStorage if backend is offline
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_NETWORK') {
        console.warn('Backend offline, saving to localStorage');
        const currentFavorites = [...favoriteRecipeIds, recipeId];
        localStorage.setItem('favorites', JSON.stringify(currentFavorites));
        notify.success('Recipe added to favorites (offline mode)!');
        return true;
      } else {
        notify.error('Failed to add recipe to favorites');
        return false;
      }
    } finally {
      setAddLoading(false);
    }
  }, [favoriteRecipeIds]);

  // Execute remove favorite API call
  const executeRemoveFavorite = useCallback(async (recipeId: number): Promise<boolean> => {
    try {
      setRemoveLoading(true);
      await FavoriteService.removeFavorite(recipeId);
      notify.success('Recipe removed from favorites!');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      
      // Fallback to localStorage if backend is offline
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_NETWORK') {
        console.warn('Backend offline, removing from localStorage');
        const currentFavorites = favoriteRecipeIds.filter(id => id !== recipeId);
        localStorage.setItem('favorites', JSON.stringify(currentFavorites));
        notify.success('Recipe removed from favorites (offline mode)!');
        return true;
      } else {
        notify.error('Failed to remove recipe from favorites');
        return false;
      }
    } finally {
      setRemoveLoading(false);
    }
  }, [favoriteRecipeIds]);

  // Add favorite
  const addFavorite = useCallback(async (recipeId: number): Promise<boolean> => {
    if (!requireAuth()) return false;

    const result = await executeAddFavorite(recipeId);
    if (result) {
      // Update local state immediately for better UX
      setFavoriteRecipeIds(prev => {
        const newFavorites = [...prev, recipeId];
        // Also save to localStorage for offline mode
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      });
      // Try to refresh full favorites list if backend is available
      try {
        await fetchFavorites();
      } catch (error) {
        // Ignore errors during refresh - we already have local state updated
        console.log('Skipped favorites refresh (backend offline)');
      }
      return true;
    }
    return false;
  }, [requireAuth, executeAddFavorite, fetchFavorites]);

  // Remove favorite
  const removeFavorite = useCallback(async (recipeId: number): Promise<boolean> => {
    if (!requireAuth()) return false;

    const result = await executeRemoveFavorite(recipeId);
    if (result) {
      // Update local state immediately for better UX
      setFavoriteRecipeIds(prev => {
        const newFavorites = prev.filter(id => id !== recipeId);
        // Also save to localStorage for offline mode
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        return newFavorites;
      });
      // Try to refresh full favorites list if backend is available
      try {
        await fetchFavorites();
      } catch (error) {
        // Ignore errors during refresh - we already have local state updated
        console.log('Skipped favorites refresh (backend offline)');
      }
      return true;
    }
    return false;
  }, [requireAuth, executeRemoveFavorite, fetchFavorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (recipeId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const isFav = favoriteRecipeIds.includes(recipeId);
    
    if (isFav) {
      await removeFavorite(recipeId);
    } else {
      await addFavorite(recipeId);
    }
  }, [isAuthenticated, favoriteRecipeIds, addFavorite, removeFavorite, navigate]);

  // Check if recipe is favorite
  const isFavorite = useCallback((recipeId: number): boolean => {
    return favoriteRecipeIds.includes(recipeId);
  }, [favoriteRecipeIds]);

  // Auto-fetch favorites when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setFavoriteRecipeIds([]);
    }
  }, [isAuthenticated, fetchFavorites]);

  return {
    // Data
    favorites,
    favoriteRecipeIds,
    
    // Loading states
    loading,
    
    // Operations
    fetchFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
}