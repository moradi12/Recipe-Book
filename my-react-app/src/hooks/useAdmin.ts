import { useState, useCallback } from 'react';
import { RecipeResponse, User } from '../Models/Recipe';
import { RecipeCreateRequest } from '../Models/RecipeCreateRequest';
import ApiService from '../Service/ApiService';
import { useApi } from './useApi';
import { useAuth } from './useAuth';

export interface AdminHookReturn {
  // Data
  pendingRecipes: RecipeResponse[];
  allUsers: User[];
  
  // Loading states
  pendingRecipesLoading: boolean;
  usersLoading: boolean;
  operationLoading: boolean;
  
  // Recipe operations
  getPendingRecipes: () => Promise<RecipeResponse[] | null>;
  approveRecipe: (id: number) => Promise<boolean>;
  rejectRecipe: (id: number) => Promise<boolean>;
  addRecipe: (recipe: RecipeCreateRequest) => Promise<boolean>;
  updateRecipe: (id: number, recipe: RecipeCreateRequest) => Promise<boolean>;
  deleteRecipe: (id: number) => Promise<boolean>;
  getAllRecipesAdmin: (page?: number, size?: number, sortBy?: string) => Promise<any>;
  
  // User operations
  getAllUsers: () => Promise<User[] | null>;
  
  // Permission checks
  isAdminAuthenticated: boolean;
}

export function useAdmin(): AdminHookReturn {
  const [pendingRecipes, setPendingRecipes] = useState<RecipeResponse[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  const { requireAuth, isAdmin } = useAuth();
  const isAdminAuthenticated = isAdmin;

  // API hooks for pending recipes
  const {
    execute: executeGetPendingRecipes,
    loading: pendingRecipesLoading,
  } = useApi(ApiService.recipes.getPendingRecipes);

  // API hooks for user management
  const {
    execute: executeGetAllUsers,
    loading: usersLoading,
  } = useApi(ApiService.users.getAllUsers);

  // API hooks for recipe operations
  const {
    execute: executeApproveRecipe,
    loading: approveLoading,
  } = useApi(ApiService.recipes.approveRecipe, {
    showSuccessNotification: true,
    successMessage: 'Recipe approved successfully!',
  });

  const {
    execute: executeRejectRecipe,
    loading: rejectLoading,
  } = useApi(ApiService.recipes.rejectRecipe, {
    showSuccessNotification: true,
    successMessage: 'Recipe rejected successfully!',
  });

  const {
    execute: executeAddRecipe,
    loading: addLoading,
  } = useApi(ApiService.recipes.addRecipeAsAdmin, {
    showSuccessNotification: true,
    successMessage: 'Recipe added successfully!',
  });

  const {
    execute: executeUpdateRecipe,
    loading: updateLoading,
  } = useApi(ApiService.recipes.updateRecipeAsAdmin, {
    showSuccessNotification: true,
    successMessage: 'Recipe updated successfully!',
  });

  const {
    execute: executeDeleteRecipe,
    loading: deleteLoading,
  } = useApi(ApiService.recipes.deleteRecipeAsAdmin, {
    showSuccessNotification: true,
    successMessage: 'Recipe deleted successfully!',
  });

  const {
    execute: executeGetAllRecipesAdmin,
  } = useApi(ApiService.recipes.getAllRecipesAsAdmin);

  const operationLoading = approveLoading || rejectLoading || addLoading || updateLoading || deleteLoading;

  // Require admin authentication for all operations
  const requireAdminAuth = useCallback((): boolean => {
    if (!requireAuth()) return false;
    if (!isAdmin) {
      console.error('Admin privileges required');
      return false;
    }
    return true;
  }, [requireAuth, isAdmin]);

  // Get pending recipes
  const getPendingRecipes = useCallback(async (): Promise<RecipeResponse[] | null> => {
    if (!requireAdminAuth()) return null;

    const recipes = await executeGetPendingRecipes();
    if (recipes) {
      setPendingRecipes(recipes);
    }
    return recipes;
  }, [requireAdminAuth, executeGetPendingRecipes]);

  // Approve recipe
  const approveRecipe = useCallback(async (id: number): Promise<boolean> => {
    if (!requireAdminAuth()) return false;

    const result = await executeApproveRecipe(id);
    if (result) {
      // Refresh pending recipes
      await getPendingRecipes();
      return true;
    }
    return false;
  }, [requireAdminAuth, executeApproveRecipe, getPendingRecipes]);

  // Reject recipe
  const rejectRecipe = useCallback(async (id: number): Promise<boolean> => {
    if (!requireAdminAuth()) return false;

    const result = await executeRejectRecipe(id);
    if (result) {
      // Refresh pending recipes
      await getPendingRecipes();
      return true;
    }
    return false;
  }, [requireAdminAuth, executeRejectRecipe, getPendingRecipes]);

  // Add recipe as admin
  const addRecipe = useCallback(async (recipe: RecipeCreateRequest): Promise<boolean> => {
    if (!requireAdminAuth()) return false;

    const result = await executeAddRecipe(recipe);
    return !!result;
  }, [requireAdminAuth, executeAddRecipe]);

  // Update recipe as admin
  const updateRecipe = useCallback(async (id: number, recipe: RecipeCreateRequest): Promise<boolean> => {
    if (!requireAdminAuth()) return false;

    const result = await executeUpdateRecipe(id, recipe);
    if (result) {
      // Refresh pending recipes if this was a pending recipe
      await getPendingRecipes();
      return true;
    }
    return false;
  }, [requireAdminAuth, executeUpdateRecipe, getPendingRecipes]);

  // Delete recipe as admin
  const deleteRecipe = useCallback(async (id: number): Promise<boolean> => {
    if (!requireAdminAuth()) return false;

    if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return false;
    }

    const result = await executeDeleteRecipe(id);
    if (result) {
      // Refresh pending recipes
      await getPendingRecipes();
      return true;
    }
    return false;
  }, [requireAdminAuth, executeDeleteRecipe, getPendingRecipes]);

  // Get all recipes as admin (with pagination)
  const getAllRecipesAdmin = useCallback(async (
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt'
  ) => {
    if (!requireAdminAuth()) return null;

    return await executeGetAllRecipesAdmin(page, size, sortBy);
  }, [requireAdminAuth, executeGetAllRecipesAdmin]);

  // Get all users
  const getAllUsers = useCallback(async (): Promise<User[] | null> => {
    if (!requireAdminAuth()) return null;

    const users = await executeGetAllUsers();
    if (users) {
      setAllUsers(users);
    }
    return users;
  }, [requireAdminAuth, executeGetAllUsers]);

  return {
    // Data
    pendingRecipes,
    allUsers,
    
    // Loading states
    pendingRecipesLoading,
    usersLoading,
    operationLoading,
    
    // Recipe operations
    getPendingRecipes,
    approveRecipe,
    rejectRecipe,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getAllRecipesAdmin,
    
    // User operations
    getAllUsers,
    
    // Permission checks
    isAdminAuthenticated,
  };
}