import { useState, useEffect, useCallback } from 'react';
import { Favorite } from '../Models/Favorite';
import FavoriteService from '../Service/FavoriteService';
import { useAuth } from './useAuth';
import { notify } from '../Utiles/notif';

export interface UseFavoritesReturn {
  favorites: Favorite[];
  favoriteRecipeIds: number[];
  loading: boolean;
  error: string | null;
  addFavorite: (recipeId: number) => Promise<void>;
  removeFavorite: (recipeId: number) => Promise<void>;
  toggleFavorite: (recipeId: number) => Promise<void>;
  isFavorite: (recipeId: number) => boolean;
  refetch: () => Promise<void>;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();

  // Update favoriteRecipeIds whenever favorites change
  useEffect(() => {
    const ids = favorites.map(fav => fav.recipe.id);
    setFavoriteRecipeIds(ids);
    console.log('Updated favorite recipe IDs:', ids);
  }, [favorites]);

  // Check if a recipe is in favorites
  const isFavorite = useCallback((recipeId: number): boolean => {
    const result = favoriteRecipeIds.includes(recipeId);
    console.log(`isFavorite(${recipeId}):`, result, 'from IDs:', favoriteRecipeIds);
    return result;
  }, [favoriteRecipeIds]);

  // Fetch favorites from server
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('Not authenticated, clearing favorites');
      setFavorites([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching favorites from server...');
      const response = await FavoriteService.getFavorites();
      console.log('Server response:', response.data);
      
      setFavorites(response.data);
      
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
      const errorMessage = err?.response?.data || 'Failed to load favorites';
      setError(errorMessage);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Add favorite with optimistic update
  const addFavorite = useCallback(async (recipeId: number) => {
    if (!isAuthenticated) {
      notify.error('Please log in to add favorites');
      return;
    }

    // Check if already favorite
    if (isFavorite(recipeId)) {
      console.log('Recipe already in favorites:', recipeId);
      notify.info('Recipe is already in your favorites');
      return;
    }

    console.log('Adding favorite for recipe:', recipeId);
    
    // Optimistic update - add to local state immediately
    const newFavoriteIds = [...favoriteRecipeIds, recipeId];
    setFavoriteRecipeIds(newFavoriteIds);
    
    try {
      setLoading(true);
      setError(null);
      
      await FavoriteService.addFavorite(recipeId);
      console.log('Successfully added favorite');
      notify.success('Recipe added to favorites!');
      
      // Fetch fresh data to ensure sync
      await fetchFavorites();
      
    } catch (err: any) {
      console.error('Error adding favorite:', err);
      
      // Revert optimistic update on error
      setFavoriteRecipeIds(favoriteRecipeIds);
      
      const errorMessage = err?.response?.data || 'Failed to add favorite';
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isFavorite, favoriteRecipeIds, fetchFavorites]);

  // Remove favorite with optimistic update
  const removeFavorite = useCallback(async (recipeId: number) => {
    if (!isAuthenticated) {
      notify.error('Please log in to remove favorites');
      return;
    }

    // Check if not in favorites
    if (!isFavorite(recipeId)) {
      console.log('Recipe not in favorites:', recipeId);
      notify.info('Recipe is not in your favorites');
      return;
    }

    console.log('Removing favorite for recipe:', recipeId);
    
    // Optimistic update - remove from local state immediately
    const newFavoriteIds = favoriteRecipeIds.filter(id => id !== recipeId);
    setFavoriteRecipeIds(newFavoriteIds);
    
    try {
      setLoading(true);
      setError(null);
      
      await FavoriteService.removeFavorite(recipeId);
      console.log('Successfully removed favorite');
      notify.success('Recipe removed from favorites!');
      
      // Fetch fresh data to ensure sync
      await fetchFavorites();
      
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      
      // Revert optimistic update on error
      setFavoriteRecipeIds(favoriteRecipeIds);
      
      const errorMessage = err?.response?.data || 'Failed to remove favorite';
      setError(errorMessage);
      notify.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isFavorite, favoriteRecipeIds, fetchFavorites]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (recipeId: number) => {
    console.log('Toggle favorite for recipe:', recipeId, 'Current state:', isFavorite(recipeId));
    
    if (isFavorite(recipeId)) {
      await removeFavorite(recipeId);
    } else {
      await addFavorite(recipeId);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  // Load favorites when user authenticates
  useEffect(() => {
    console.log('Auth state changed, authenticated:', isAuthenticated);
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    favoriteRecipeIds,
    loading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
}