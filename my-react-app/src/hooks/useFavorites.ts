import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Favorite } from '../Models/Favorite';
import FavoriteService from '../Service/FavoriteService';
import { useAuth } from './useAuth';
import { notify } from '../Utiles/notif';

const STORAGE_KEY = 'recipe_favorites';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface FavoritesCache {
  data: number[];
  timestamp: number;
}

export interface FavoritesHookReturn {
  // Data
  favorites: Favorite[];
  favoriteRecipeIds: number[];
  
  // Loading states
  loading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Operations
  fetchFavorites: () => Promise<void>;
  addFavorite: (recipeId: number) => Promise<boolean>;
  removeFavorite: (recipeId: number) => Promise<boolean>;
  toggleFavorite: (recipeId: number) => Promise<void>;
  isFavorite: (recipeId: number) => boolean;
  clearError: () => void;
  refetch: () => Promise<void>;
}

export function useFavorites(): FavoritesHookReturn {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth } = useAuth();

  // Loading states
  const [fetchLoading, setFetchLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  
  const loading = fetchLoading || addLoading || removeLoading;

  // Memoized cache helpers
  const cacheHelpers = useMemo(() => ({
    saveToCache: (data: number[]) => {
      const cache: FavoritesCache = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    },
    
    loadFromCache: (): number[] | null => {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (!cached) return null;
        
        const cache: FavoritesCache = JSON.parse(cached);
        const isExpired = Date.now() - cache.timestamp > CACHE_DURATION;
        
        return isExpired ? null : cache.data;
      } catch {
        return null;
      }
    },
    
    clearCache: () => {
      localStorage.removeItem(STORAGE_KEY);
    }
  }), []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch favorites with improved error handling and caching
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoriteRecipeIds([]);
      setIsInitialized(true);
      return;
    }

    try {
      setFetchLoading(true);
      setError(null);
      
      // Try to load from cache first for better UX
      const cachedData = cacheHelpers.loadFromCache();
      if (cachedData && !isInitialized) {
        setFavoriteRecipeIds(cachedData);
      }
      
      const response = await FavoriteService.getFavorites();
      const data = response.data;
      
      setFavorites(data);
      const recipeIds = data.map((fav: Favorite) => fav.recipeId);
      setFavoriteRecipeIds(recipeIds);
      
      // Update cache
      cacheHelpers.saveToCache(recipeIds);
      
    } catch (error: any) {
      const isNetworkError = error?.code === 'ERR_NETWORK' || error?.code === 'ECONNABORTED';
      
      if (isNetworkError) {
        console.warn('Backend server is offline. Using cached data.');
        const cachedData = cacheHelpers.loadFromCache();
        
        if (cachedData) {
          setFavoriteRecipeIds(cachedData);
          setError('Working offline - some features may be limited');
        } else {
          setFavoriteRecipeIds([]);
          setError('Unable to load favorites - please check your connection');
        }
      } else {
        console.error('Error fetching favorites:', error);
        setError('Failed to load favorites');
        notify.error('Failed to fetch favorites');
      }
    } finally {
      setFetchLoading(false);
      setIsInitialized(true);
    }
  }, [isAuthenticated, cacheHelpers, isInitialized]);

  // Execute add favorite API call with optimistic updates
  const executeAddFavorite = useCallback(async (recipeId: number): Promise<boolean> => {
    try {
      setAddLoading(true);
      setError(null);
      
      await FavoriteService.addFavorite(recipeId);
      notify.success('Recipe added to favorites!');
      return true;
      
    } catch (error: any) {
      const isNetworkError = error?.code === 'ERR_NETWORK';
      
      if (isNetworkError) {
        console.warn('Backend offline, saving to cache');
        const updatedFavorites = [...favoriteRecipeIds, recipeId];
        cacheHelpers.saveToCache(updatedFavorites);
        notify.success('Recipe added to favorites (offline mode)!');
        return true;
      } else {
        console.error('Error adding favorite:', error);
        console.error('Error response data:', error?.response?.data);
        console.error('Error response status:', error?.response?.status);
        const errorMessage = error?.response?.data || error.message || 'Unknown error';
        setError(`Failed to add recipe to favorites: ${errorMessage}`);
        notify.error(`Failed to add recipe to favorites: ${errorMessage}`);
        return false;
      }
    } finally {
      setAddLoading(false);
    }
  }, [favoriteRecipeIds, cacheHelpers]);

  // Execute remove favorite API call with optimistic updates
  const executeRemoveFavorite = useCallback(async (recipeId: number): Promise<boolean> => {
    try {
      setRemoveLoading(true);
      setError(null);
      
      await FavoriteService.removeFavorite(recipeId);
      notify.success('Recipe removed from favorites!');
      return true;
      
    } catch (error: any) {
      const isNetworkError = error?.code === 'ERR_NETWORK';
      
      if (isNetworkError) {
        console.warn('Backend offline, removing from cache');
        const updatedFavorites = favoriteRecipeIds.filter(id => id !== recipeId);
        cacheHelpers.saveToCache(updatedFavorites);
        notify.success('Recipe removed from favorites (offline mode)!');
        return true;
      } else {
        console.error('Error removing favorite:', error);
        console.error('Error response data:', error?.response?.data);
        console.error('Error response status:', error?.response?.status);
        const errorMessage = error?.response?.data || error.message || 'Unknown error';
        setError(`Failed to remove recipe from favorites: ${errorMessage}`);
        notify.error(`Failed to remove recipe from favorites: ${errorMessage}`);
        return false;
      }
    } finally {
      setRemoveLoading(false);
    }
  }, [favoriteRecipeIds, cacheHelpers]);

  // Add favorite with optimistic updates
  const addFavorite = useCallback(async (recipeId: number): Promise<boolean> => {
    if (!requireAuth()) return false;

    // Check if already a favorite to prevent duplicate calls
    if (favoriteRecipeIds.includes(recipeId)) {
      notify.info('Recipe is already in your favorites');
      return true;
    }

    // Optimistic update
    const previousFavorites = favoriteRecipeIds;
    setFavoriteRecipeIds(prev => [...prev, recipeId]);
    
    try {
      const result = await executeAddFavorite(recipeId);
      
      if (result) {
        // Update cache with the current state (which already includes the recipe from optimistic update)
        cacheHelpers.saveToCache([...previousFavorites, recipeId]);
        return true;
      } else {
        // Revert optimistic update on failure
        setFavoriteRecipeIds(previousFavorites);
        return false;
      }
    } catch (error) {
      // Revert optimistic update on error
      setFavoriteRecipeIds(previousFavorites);
      return false;
    }
  }, [requireAuth, executeAddFavorite, favoriteRecipeIds, cacheHelpers]);

  // Remove favorite with optimistic updates
  const removeFavorite = useCallback(async (recipeId: number): Promise<boolean> => {
    if (!requireAuth()) return false;

    // Check if not a favorite to prevent unnecessary calls
    if (!favoriteRecipeIds.includes(recipeId)) {
      notify.info('Recipe is not in your favorites');
      return true;
    }

    // Optimistic update
    const previousFavorites = favoriteRecipeIds;
    setFavoriteRecipeIds(prev => prev.filter(id => id !== recipeId));
    
    try {
      const result = await executeRemoveFavorite(recipeId);
      
      if (result) {
        // Update cache with the previous state filtered (since optimistic update already removed it)
        cacheHelpers.saveToCache(previousFavorites.filter(id => id !== recipeId));
        return true;
      } else {
        // Revert optimistic update on failure
        setFavoriteRecipeIds(previousFavorites);
        return false;
      }
    } catch (error) {
      // Revert optimistic update on error
      setFavoriteRecipeIds(previousFavorites);
      return false;
    }
  }, [requireAuth, executeRemoveFavorite, favoriteRecipeIds, cacheHelpers]);

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

  // Check if recipe is favorite (memoized for performance)
  const isFavorite = useCallback((recipeId: number): boolean => {
    return favoriteRecipeIds.includes(recipeId);
  }, [favoriteRecipeIds]);
  
  // Refetch method for manual refresh
  const refetch = useCallback(async () => {
    setIsInitialized(false);
    await fetchFavorites();
  }, [fetchFavorites]);

  // Auto-fetch favorites when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]);
      setFavoriteRecipeIds([]);
      setIsInitialized(true);
      setError(null);
      cacheHelpers.clearCache();
    }
  }, [isAuthenticated, fetchFavorites, cacheHelpers]);

  return {
    // Data
    favorites,
    favoriteRecipeIds,
    
    // States
    loading,
    isInitialized,
    error,
    
    // Operations
    fetchFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearError,
    refetch,
  };
}