import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeResponse } from '../Models/RecipeResponse';
import { RecipeCreateRequest } from '../Models/RecipeCreateRequest';
import { RecipeStatus } from '../Models/RecipeStatus';
import { Category } from '../Models/Category';
import axios from 'axios';
import { recipeSystem } from '../Pages/Redux/store';
import { PaginatedRecipes } from '../Service/RecipeService';
import { notify } from '../Utiles/notif';
import { useAuth } from './useAuth';

export interface PaginationState {
  page: number;
  size: number;
  totalPages: number;
  totalElements?: number;
}

export interface RecipesHookReturn {
  // Data
  recipes: RecipeResponse[];
  categories: Category[];
  pagination: PaginationState;
  
  // Loading states
  recipesLoading: boolean;
  categoriesLoading: boolean;
  
  // Operations
  fetchRecipes: (page?: number, size?: number, category?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createRecipe: (recipe: RecipeCreateRequest) => Promise<boolean>;
  updateRecipe: (id: number, recipe: RecipeResponse) => Promise<boolean>;
  deleteRecipe: (id: number) => Promise<boolean>;
  approveRecipe: (id: number) => Promise<boolean>;
  rejectRecipe: (id: number) => Promise<boolean>;
  updateRecipeStatus: (id: number, status: RecipeStatus) => Promise<boolean>;
  searchRecipes: (title: string) => Promise<RecipeResponse[] | null>;
  getMyRecipes: () => Promise<RecipeResponse[] | null>;
  
  // Pagination
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setPaginationSize: (size: number) => void;
  
  // Filters
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  
  // Permissions
  canEdit: boolean;
  canApprove: boolean;
  canDelete: boolean;
}

export function useRecipes(): RecipesHookReturn {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: 10,
    totalPages: 0,
  });

  // Loading states
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const navigate = useNavigate();
  const { requireAuth, hasRole } = useAuth();

  // Permission checks
  const canEdit = hasRole('ADMIN') || hasRole('EDITOR');
  const canApprove = hasRole('ADMIN');
  const canDelete = hasRole('ADMIN');

  // Normalize recipes
  const normalizeRecipes = useCallback((recipes: RecipeResponse[]): RecipeResponse[] => {
    return recipes.map((recipe) => ({
      ...recipe,
      categories:
        recipe.categories && recipe.categories.length > 0
          ? recipe.categories
          : ['Uncategorized'],
    }));
  }, []);

  // Fetch recipes
  const fetchRecipes = useCallback(async (
    page: number = pagination.page,
    size: number = pagination.size,
    category?: number
  ) => {
    try {
      setRecipesLoading(true);
      const categoryParam = category || (filterCategory ? Number(filterCategory) : undefined);
      
      // Build URL with parameters
      const baseUrl = 'http://localhost:8080/api/recipes';
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      if (categoryParam !== undefined) {
        params.append('category', categoryParam.toString());
      }
      
      const url = `${baseUrl}?${params.toString()}`;
      console.log('Making request to:', url);
      
      // Get token for auth
      const token = recipeSystem.getState().auth.token;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      
      const normalized = normalizeRecipes(data.content);
      setRecipes(normalized);
      setPagination(prev => ({
        ...prev,
        page,
        size,
        totalPages: data.totalPages,
        totalElements: data.totalElements,
      }));
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      console.error('Request URL:', error.config?.url);
      console.error('Request method:', error.config?.method);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      notify.error(`Failed to load recipes (${error.response?.status || 'Network Error'})`);
    } finally {
      setRecipesLoading(false);
    }
  }, [pagination.page, pagination.size, filterCategory, normalizeRecipes]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const token = recipeSystem.getState().auth.token;
      const response = await axios.get('http://localhost:8080/api/recipes/categories', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      setCategories(response.data);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      notify.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Create recipe
  const createRecipe = useCallback(async (recipe: RecipeCreateRequest): Promise<boolean> => {
    if (!requireAuth()) return false;
    
    try {
      const token = recipeSystem.getState().auth.token;
      await axios.post('http://localhost:8080/api/recipes', recipe, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      notify.success('Recipe created successfully!');
      await fetchRecipes(); // Refresh recipes
      navigate('/all/recipes');
      return true;
    } catch (error: any) {
      console.error('Error creating recipe:', error);
      notify.error('Failed to create recipe');
      return false;
    }
  }, [requireAuth, fetchRecipes, navigate]);

  // Update recipe
  const updateRecipe = useCallback(async (id: number, recipe: RecipeResponse): Promise<boolean> => {
    if (!requireAuth()) return false;
    
    try {
      const token = recipeSystem.getState().auth.token;
      await axios.put(`http://localhost:8080/api/recipes/${id}`, recipe, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      notify.success('Recipe updated successfully!');
      await fetchRecipes();
      return true;
    } catch (error: any) {
      console.error('Error updating recipe:', error);
      notify.error('Failed to update recipe');
      return false;
    }
  }, [requireAuth, fetchRecipes]);

  // Delete recipe
  const deleteRecipe = useCallback(async (id: number): Promise<boolean> => {
    if (!requireAuth()) return false;
    
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return false;
    }
    
    try {
      const token = recipeSystem.getState().auth.token;
      await axios.delete(`http://localhost:8080/api/recipes/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      notify.success('Recipe deleted successfully!');
      await fetchRecipes();
      return true;
    } catch (error: any) {
      console.error('Error deleting recipe:', error);
      notify.error('Failed to delete recipe');
      return false;
    }
  }, [requireAuth, fetchRecipes]);

  // Approve recipe
  const approveRecipe = useCallback(async (id: number): Promise<boolean> => {
    if (!requireAuth()) return false;
    
    try {
      const token = recipeSystem.getState().auth.token;
      await axios.put(`http://localhost:8080/api/admin/recipes/${id}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      notify.success('Recipe approved successfully!');
      await fetchRecipes();
      return true;
    } catch (error: any) {
      console.error('Error approving recipe:', error);
      notify.error('Failed to approve recipe');
      return false;
    }
  }, [requireAuth, fetchRecipes]);

  // Reject recipe
  const rejectRecipe = useCallback(async (id: number): Promise<boolean> => {
    if (!requireAuth()) return false;
    
    try {
      const token = recipeSystem.getState().auth.token;
      await axios.put(`http://localhost:8080/api/admin/recipes/${id}/reject`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      notify.success('Recipe rejected successfully!');
      await fetchRecipes();
      return true;
    } catch (error: any) {
      console.error('Error rejecting recipe:', error);
      notify.error('Failed to reject recipe');
      return false;
    }
  }, [requireAuth, fetchRecipes]);

  // Update recipe status
  const updateRecipeStatus = useCallback(async (id: number, status: RecipeStatus): Promise<boolean> => {
    if (!requireAuth()) return false;
    
    try {
      const token = recipeSystem.getState().auth.token;
      await axios.put(`http://localhost:8080/api/recipes/${id}/status`, { status }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      notify.success('Recipe status updated successfully!');
      await fetchRecipes();
      return true;
    } catch (error: any) {
      console.error('Error updating recipe status:', error);
      notify.error('Failed to update recipe status');
      return false;
    }
  }, [requireAuth, fetchRecipes]);

  // Search recipes
  const searchRecipes = useCallback(async (title: string): Promise<RecipeResponse[] | null> => {
    try {
      const token = recipeSystem.getState().auth.token;
      const response = await axios.get(`http://localhost:8080/api/recipes/search?title=${encodeURIComponent(title)}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      return normalizeRecipes(response.data);
    } catch (error: any) {
      console.error('Error searching recipes:', error);
      notify.error('Failed to search recipes');
      return null;
    }
  }, [normalizeRecipes]);

  // Get my recipes
  const getMyRecipes = useCallback(async (): Promise<RecipeResponse[] | null> => {
    if (!requireAuth()) return null;
    
    try {
      const token = recipeSystem.getState().auth.token;
      const response = await axios.get('http://localhost:8080/api/recipes/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return normalizeRecipes(response.data);
    } catch (error: any) {
      console.error('Error fetching my recipes:', error);
      notify.error('Failed to load your recipes');
      return null;
    }
  }, [requireAuth, normalizeRecipes]);

  // Pagination functions
  const nextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages - 1) {
      const newPage = pagination.page + 1;
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchRecipes(newPage);
    }
  }, [pagination.page, pagination.totalPages, fetchRecipes]);

  const prevPage = useCallback(() => {
    if (pagination.page > 0) {
      const newPage = pagination.page - 1;
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchRecipes(newPage);
    }
  }, [pagination.page, fetchRecipes]);

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }));
      fetchRecipes(page);
    }
  }, [pagination.totalPages, fetchRecipes]);

  const setPaginationSize = useCallback((size: number) => {
    setPagination(prev => ({ ...prev, size, page: 0 }));
    fetchRecipes(0, size);
  }, [fetchRecipes]);

  // Filter category change handler
  const handleFilterCategoryChange = useCallback((category: string) => {
    setFilterCategory(category);
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  // Auto-fetch recipes when filter changes
  useEffect(() => {
    fetchRecipes();
  }, [filterCategory]);

  return {
    // Data
    recipes,
    categories,
    pagination,
    
    // Loading states
    recipesLoading,
    categoriesLoading,
    
    // Operations
    fetchRecipes,
    fetchCategories,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    approveRecipe,
    rejectRecipe,
    updateRecipeStatus,
    searchRecipes,
    getMyRecipes,
    
    // Pagination
    nextPage,
    prevPage,
    goToPage,
    setPaginationSize,
    
    // Filters
    filterCategory,
    setFilterCategory: handleFilterCategoryChange,
    
    // Permissions
    canEdit,
    canApprove,
    canDelete,
  };
}