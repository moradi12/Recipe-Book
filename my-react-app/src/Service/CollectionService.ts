import { AxiosResponse } from 'axios';
import { BaseApiService } from './BaseApiService';
import { RecipeResponse } from '../Models/RecipeResponse';

export interface RecipeCollection {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  createdBy: number;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
  recipeCount: number;
  coverImage?: string;
  tags: string[];
}

export interface CollectionWithRecipes extends RecipeCollection {
  recipes: RecipeResponse[];
}

export interface MealPlan {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdBy: number;
  createdByUsername: string;
  meals: MealPlanDay[];
}

export interface MealPlanDay {
  id: number;
  date: string;
  breakfast?: RecipeResponse;
  lunch?: RecipeResponse;
  dinner?: RecipeResponse;
  snacks: RecipeResponse[];
}

export interface ShoppingList {
  id: number;
  name: string;
  items: ShoppingListItem[];
  createdAt: string;
  isCompleted: boolean;
}

export interface ShoppingListItem {
  id: number;
  ingredient: string;
  quantity: string;
  unit: string;
  isChecked: boolean;
  recipeId?: number;
  recipeTitle?: string;
}

class CollectionService extends BaseApiService {
  private static instance: CollectionService;

  private constructor() {
    super('http://localhost:8080/api/collections');
  }

  public static getInstance(): CollectionService {
    if (!CollectionService.instance) {
      CollectionService.instance = new CollectionService();
    }
    return CollectionService.instance;
  }

  // ===========================
  // RECIPE COLLECTIONS
  // ===========================

  public async getUserCollections(): Promise<AxiosResponse<RecipeCollection[]>> {
    return this.get<RecipeCollection[]>('/my');
  }

  public async getPublicCollections(limit: number = 20): Promise<AxiosResponse<RecipeCollection[]>> {
    return this.get<RecipeCollection[]>(`/public?limit=${limit}`);
  }

  public async getCollection(collectionId: number): Promise<AxiosResponse<CollectionWithRecipes>> {
    return this.get<CollectionWithRecipes>(`/${collectionId}`);
  }

  public async createCollection(collection: {
    name: string;
    description?: string;
    isPublic: boolean;
    tags?: string[];
  }): Promise<AxiosResponse<RecipeCollection>> {
    return this.post<RecipeCollection>('', collection);
  }

  public async updateCollection(
    collectionId: number, 
    updates: Partial<RecipeCollection>
  ): Promise<AxiosResponse<RecipeCollection>> {
    return this.put<RecipeCollection>(`/${collectionId}`, updates);
  }

  public async deleteCollection(collectionId: number): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/${collectionId}`);
  }

  public async addRecipeToCollection(
    collectionId: number, 
    recipeId: number
  ): Promise<AxiosResponse<{ message: string }>> {
    return this.post<{ message: string }>(`/${collectionId}/recipes/${recipeId}`, {});
  }

  public async removeRecipeFromCollection(
    collectionId: number, 
    recipeId: number
  ): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/${collectionId}/recipes/${recipeId}`);
  }

  public async duplicateCollection(collectionId: number): Promise<AxiosResponse<RecipeCollection>> {
    return this.post<RecipeCollection>(`/${collectionId}/duplicate`, {});
  }

  // ===========================
  // MEAL PLANNING
  // ===========================

  public async getMealPlans(): Promise<AxiosResponse<MealPlan[]>> {
    return this.get<MealPlan[]>('/meal-plans/my');
  }

  public async getMealPlan(planId: number): Promise<AxiosResponse<MealPlan>> {
    return this.get<MealPlan>(`/meal-plans/${planId}`);
  }

  public async createMealPlan(plan: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
  }): Promise<AxiosResponse<MealPlan>> {
    return this.post<MealPlan>('/meal-plans', plan);
  }

  public async updateMealPlan(planId: number, updates: Partial<MealPlan>): Promise<AxiosResponse<MealPlan>> {
    return this.put<MealPlan>(`/meal-plans/${planId}`, updates);
  }

  public async deleteMealPlan(planId: number): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/meal-plans/${planId}`);
  }

  public async addRecipeToMealPlan(
    planId: number,
    date: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    recipeId: number
  ): Promise<AxiosResponse<MealPlanDay>> {
    return this.post<MealPlanDay>(`/meal-plans/${planId}/meals`, {
      date,
      mealType,
      recipeId
    });
  }

  public async removeRecipeFromMealPlan(
    planId: number,
    dayId: number,
    mealType: string
  ): Promise<AxiosResponse<MealPlanDay>> {
    return this.delete<MealPlanDay>(`/meal-plans/${planId}/days/${dayId}/meals/${mealType}`);
  }

  // ===========================
  // SHOPPING LISTS
  // ===========================

  public async getShoppingLists(): Promise<AxiosResponse<ShoppingList[]>> {
    return this.get<ShoppingList[]>('/shopping-lists/my');
  }

  public async getShoppingList(listId: number): Promise<AxiosResponse<ShoppingList>> {
    return this.get<ShoppingList>(`/shopping-lists/${listId}`);
  }

  public async createShoppingList(list: {
    name: string;
    items?: ShoppingListItem[];
  }): Promise<AxiosResponse<ShoppingList>> {
    return this.post<ShoppingList>('/shopping-lists', list);
  }

  public async generateShoppingListFromMealPlan(planId: number): Promise<AxiosResponse<ShoppingList>> {
    return this.post<ShoppingList>(`/shopping-lists/from-meal-plan/${planId}`, {});
  }

  public async generateShoppingListFromCollection(collectionId: number): Promise<AxiosResponse<ShoppingList>> {
    return this.post<ShoppingList>(`/shopping-lists/from-collection/${collectionId}`, {});
  }

  public async updateShoppingList(
    listId: number, 
    updates: Partial<ShoppingList>
  ): Promise<AxiosResponse<ShoppingList>> {
    return this.put<ShoppingList>(`/shopping-lists/${listId}`, updates);
  }

  public async deleteShoppingList(listId: number): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/shopping-lists/${listId}`);
  }

  public async addItemToShoppingList(
    listId: number,
    item: Omit<ShoppingListItem, 'id' | 'isChecked'>
  ): Promise<AxiosResponse<ShoppingListItem>> {
    return this.post<ShoppingListItem>(`/shopping-lists/${listId}/items`, item);
  }

  public async updateShoppingListItem(
    listId: number,
    itemId: number,
    updates: Partial<ShoppingListItem>
  ): Promise<AxiosResponse<ShoppingListItem>> {
    return this.put<ShoppingListItem>(`/shopping-lists/${listId}/items/${itemId}`, updates);
  }

  public async deleteShoppingListItem(
    listId: number,
    itemId: number
  ): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/shopping-lists/${listId}/items/${itemId}`);
  }

  public async toggleShoppingListItem(
    listId: number,
    itemId: number
  ): Promise<AxiosResponse<ShoppingListItem>> {
    return this.put<ShoppingListItem>(`/shopping-lists/${listId}/items/${itemId}/toggle`, {});
  }

  // ===========================
  // SEARCH & DISCOVERY
  // ===========================

  public async searchCollections(query: string): Promise<AxiosResponse<RecipeCollection[]>> {
    return this.get<RecipeCollection[]>(`/search?q=${encodeURIComponent(query)}`);
  }

  public async getPopularCollections(limit: number = 10): Promise<AxiosResponse<RecipeCollection[]>> {
    return this.get<RecipeCollection[]>(`/popular?limit=${limit}`);
  }

  public async getCollectionsByTag(tag: string): Promise<AxiosResponse<RecipeCollection[]>> {
    return this.get<RecipeCollection[]>(`/tag/${encodeURIComponent(tag)}`);
  }

  public async getCollectionTags(): Promise<AxiosResponse<{ tag: string; count: number }[]>> {
    return this.get<{ tag: string; count: number }[]>('/tags');
  }
}

export default CollectionService.getInstance();
export { CollectionService };