import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import CollectionService, { 
  RecipeCollection, 
  CollectionWithRecipes,
  MealPlan,
  ShoppingList 
} from '../Service/CollectionService';
import { notify } from '../Utiles/notif';

export const useCollections = () => {
  const { requireAuth } = useAuth();
  const [collections, setCollections] = useState<RecipeCollection[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch user's collections
  const fetchCollections = useCallback(async () => {
    if (!requireAuth()) return;

    try {
      setLoading(true);
      const response = await CollectionService.getUserCollections();
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
      
      // Fallback to mock data for development
      setCollections([
        {
          id: 1,
          name: 'Favorite Desserts',
          description: 'My collection of the best dessert recipes',
          isPublic: true,
          createdBy: 1,
          createdByUsername: 'user1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          recipeCount: 12,
          coverImage: '/images/desserts.jpg',
          tags: ['desserts', 'sweet', 'baking']
        },
        {
          id: 2,
          name: 'Quick Weeknight Dinners',
          description: 'Fast and easy recipes for busy weeknights',
          isPublic: false,
          createdBy: 1,
          createdByUsername: 'user1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          recipeCount: 8,
          tags: ['quick', 'dinner', 'easy']
        }
      ]);
      
      notify.warning('Using demo data - start backend server for full functionality');
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  // Fetch meal plans
  const fetchMealPlans = useCallback(async () => {
    if (!requireAuth()) return;

    try {
      const response = await CollectionService.getMealPlans();
      setMealPlans(response.data);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      
      // Mock data
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 7);

      setMealPlans([
        {
          id: 1,
          name: 'This Week\'s Meals',
          description: 'Planned meals for the current week',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          createdBy: 1,
          createdByUsername: 'user1',
          meals: []
        }
      ]);
    }
  }, [requireAuth]);

  // Fetch shopping lists
  const fetchShoppingLists = useCallback(async () => {
    if (!requireAuth()) return;

    try {
      const response = await CollectionService.getShoppingLists();
      setShoppingLists(response.data);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
      
      // Mock data
      setShoppingLists([
        {
          id: 1,
          name: 'Weekly Groceries',
          items: [
            {
              id: 1,
              ingredient: 'Eggs',
              quantity: '12',
              unit: 'pieces',
              isChecked: false,
              recipeId: 1,
              recipeTitle: 'Scrambled Eggs'
            },
            {
              id: 2,
              ingredient: 'Milk',
              quantity: '1',
              unit: 'liter',
              isChecked: true
            }
          ],
          createdAt: new Date().toISOString(),
          isCompleted: false
        }
      ]);
    }
  }, [requireAuth]);

  // Create new collection
  const createCollection = useCallback(async (collection: {
    name: string;
    description?: string;
    isPublic: boolean;
    tags?: string[];
  }) => {
    if (!requireAuth()) return false;

    try {
      setActionLoading(true);
      const response = await CollectionService.createCollection(collection);
      setCollections(prev => [response.data, ...prev]);
      notify.success('Collection created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating collection:', error);
      notify.error('Failed to create collection');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [requireAuth]);

  // Update collection
  const updateCollection = useCallback(async (
    collectionId: number, 
    updates: Partial<RecipeCollection>
  ) => {
    if (!requireAuth()) return false;

    try {
      setActionLoading(true);
      const response = await CollectionService.updateCollection(collectionId, updates);
      setCollections(prev => 
        prev.map(col => col.id === collectionId ? response.data : col)
      );
      notify.success('Collection updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating collection:', error);
      notify.error('Failed to update collection');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [requireAuth]);

  // Delete collection
  const deleteCollection = useCallback(async (collectionId: number) => {
    if (!requireAuth()) return false;

    if (!window.confirm('Are you sure you want to delete this collection?')) {
      return false;
    }

    try {
      setActionLoading(true);
      await CollectionService.deleteCollection(collectionId);
      setCollections(prev => prev.filter(col => col.id !== collectionId));
      notify.success('Collection deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      notify.error('Failed to delete collection');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [requireAuth]);

  // Add recipe to collection
  const addRecipeToCollection = useCallback(async (
    collectionId: number, 
    recipeId: number
  ) => {
    if (!requireAuth()) return false;

    try {
      await CollectionService.addRecipeToCollection(collectionId, recipeId);
      
      // Update recipe count
      setCollections(prev => 
        prev.map(col => 
          col.id === collectionId 
            ? { ...col, recipeCount: col.recipeCount + 1 }
            : col
        )
      );
      
      notify.success('Recipe added to collection');
      return true;
    } catch (error) {
      console.error('Error adding recipe to collection:', error);
      notify.error('Failed to add recipe to collection');
      return false;
    }
  }, [requireAuth]);

  // Remove recipe from collection
  const removeRecipeFromCollection = useCallback(async (
    collectionId: number, 
    recipeId: number
  ) => {
    if (!requireAuth()) return false;

    try {
      await CollectionService.removeRecipeFromCollection(collectionId, recipeId);
      
      // Update recipe count
      setCollections(prev => 
        prev.map(col => 
          col.id === collectionId 
            ? { ...col, recipeCount: Math.max(0, col.recipeCount - 1) }
            : col
        )
      );
      
      notify.success('Recipe removed from collection');
      return true;
    } catch (error) {
      console.error('Error removing recipe from collection:', error);
      notify.error('Failed to remove recipe from collection');
      return false;
    }
  }, [requireAuth]);

  // Create meal plan
  const createMealPlan = useCallback(async (plan: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
  }) => {
    if (!requireAuth()) return false;

    try {
      setActionLoading(true);
      const response = await CollectionService.createMealPlan(plan);
      setMealPlans(prev => [response.data, ...prev]);
      notify.success('Meal plan created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating meal plan:', error);
      notify.error('Failed to create meal plan');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [requireAuth]);

  // Create shopping list
  const createShoppingList = useCallback(async (list: {
    name: string;
    items?: any[];
  }) => {
    if (!requireAuth()) return false;

    try {
      setActionLoading(true);
      const response = await CollectionService.createShoppingList(list);
      setShoppingLists(prev => [response.data, ...prev]);
      notify.success('Shopping list created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating shopping list:', error);
      notify.error('Failed to create shopping list');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [requireAuth]);

  // Generate shopping list from meal plan
  const generateShoppingListFromMealPlan = useCallback(async (planId: number) => {
    if (!requireAuth()) return false;

    try {
      setActionLoading(true);
      const response = await CollectionService.generateShoppingListFromMealPlan(planId);
      setShoppingLists(prev => [response.data, ...prev]);
      notify.success('Shopping list generated from meal plan');
      return response.data;
    } catch (error) {
      console.error('Error generating shopping list:', error);
      notify.error('Failed to generate shopping list');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [requireAuth]);

  useEffect(() => {
    fetchCollections();
    fetchMealPlans();
    fetchShoppingLists();
  }, [fetchCollections, fetchMealPlans, fetchShoppingLists]);

  return {
    collections,
    mealPlans,
    shoppingLists,
    loading,
    actionLoading,
    createCollection,
    updateCollection,
    deleteCollection,
    addRecipeToCollection,
    removeRecipeFromCollection,
    createMealPlan,
    createShoppingList,
    generateShoppingListFromMealPlan,
    refreshCollections: fetchCollections,
    refreshMealPlans: fetchMealPlans,
    refreshShoppingLists: fetchShoppingLists
  };
};