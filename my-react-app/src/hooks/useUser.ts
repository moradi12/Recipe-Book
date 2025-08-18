import { useState, useCallback } from 'react';
import { User } from '../Models/Recipe';
import ApiService from '../Service/ApiService';
import { useApi } from './useApi';
import { useAuth } from './useAuth';

export interface UserHookReturn {
  // Data
  currentUser: User | null;
  users: User[];
  
  // Loading states
  currentUserLoading: boolean;
  usersLoading: boolean;
  updateLoading: boolean;
  
  // Operations
  getCurrentUser: () => Promise<User | null>;
  getAllUsers: () => Promise<User[] | null>;
  updateUserDetails: (newEmail?: string, newPassword?: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  addFavoriteRecipe: (userId: number, recipeId: number) => Promise<boolean>;
  removeFavoriteRecipe: (userId: number, recipeId: number) => Promise<boolean>;
}

export function useUser(): UserHookReturn {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  
  const { requireAuth, isAdmin } = useAuth();

  // API hooks
  const {
    execute: executeGetCurrentUser,
    loading: currentUserLoading,
  } = useApi(ApiService.users.getCurrentUser);

  const {
    execute: executeGetAllUsers,
    loading: usersLoading,
  } = useApi(ApiService.users.getAllUsers);

  const {
    execute: executeUpdateUserDetails,
    loading: updateDetailsLoading,
  } = useApi(ApiService.users.updateUserDetails, {
    showSuccessNotification: true,
    successMessage: 'User details updated successfully!',
  });

  const {
    execute: executeUpdatePassword,
    loading: updatePasswordLoading,
  } = useApi(ApiService.users.updatePassword, {
    showSuccessNotification: true,
    successMessage: 'Password updated successfully!',
  });

  const {
    execute: executeAddFavorite,
  } = useApi(ApiService.users.addFavoriteRecipe, {
    showSuccessNotification: true,
    successMessage: 'Recipe added to favorites!',
  });

  const {
    execute: executeRemoveFavorite,
  } = useApi(ApiService.users.removeFavoriteRecipe, {
    showSuccessNotification: true,
    successMessage: 'Recipe removed from favorites!',
  });

  const updateLoading = updateDetailsLoading || updatePasswordLoading;

  // Get current user
  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    if (!requireAuth()) return null;

    const user = await executeGetCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    return user;
  }, [requireAuth, executeGetCurrentUser]);

  // Get all users (admin only)
  const getAllUsers = useCallback(async (): Promise<User[] | null> => {
    if (!requireAuth() || !isAdmin) {
      console.warn('Admin privileges required to fetch all users');
      return null;
    }

    const usersList = await executeGetAllUsers();
    if (usersList) {
      setUsers(usersList);
    }
    return usersList;
  }, [requireAuth, isAdmin, executeGetAllUsers]);

  // Update user details
  const updateUserDetails = useCallback(async (
    newEmail?: string,
    newPassword?: string
  ): Promise<boolean> => {
    if (!requireAuth()) return false;

    const result = await executeUpdateUserDetails(newEmail, newPassword);
    if (result) {
      // Refresh current user data
      await getCurrentUser();
      return true;
    }
    return false;
  }, [requireAuth, executeUpdateUserDetails, getCurrentUser]);

  // Update password
  const updatePassword = useCallback(async (newPassword: string): Promise<boolean> => {
    if (!requireAuth()) return false;

    const result = await executeUpdatePassword(newPassword);
    if (result) {
      return true;
    }
    return false;
  }, [requireAuth, executeUpdatePassword]);

  // Add favorite recipe (for specific user)
  const addFavoriteRecipe = useCallback(async (
    userId: number,
    recipeId: number
  ): Promise<boolean> => {
    if (!requireAuth()) return false;

    const result = await executeAddFavorite(userId, recipeId);
    return !!result;
  }, [requireAuth, executeAddFavorite]);

  // Remove favorite recipe (for specific user)
  const removeFavoriteRecipe = useCallback(async (
    userId: number,
    recipeId: number
  ): Promise<boolean> => {
    if (!requireAuth()) return false;

    const result = await executeRemoveFavorite(userId, recipeId);
    return !!result;
  }, [requireAuth, executeRemoveFavorite]);

  return {
    // Data
    currentUser,
    users,
    
    // Loading states
    currentUserLoading,
    usersLoading,
    updateLoading,
    
    // Operations
    getCurrentUser,
    getAllUsers,
    updateUserDetails,
    updatePassword,
    addFavoriteRecipe,
    removeFavoriteRecipe,
  };
}