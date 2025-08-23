import { AxiosResponse } from 'axios';
import { BaseApiService } from './BaseApiService';
import { ErrorHandler } from '../errors/ErrorHandler';
import { Category } from '../Models/Category';
import { RecipeResponse, UpdateStatusResponse } from '../Models/Recipe';
import { RecipeCreateRequest } from '../Models/RecipeCreateRequest';
import { RecipeStatus } from '../Models/RecipeStatus';

export interface PaginatedRecipes {
  content: RecipeResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

class RecipeService extends BaseApiService {
  private static instance: RecipeService;
  private adminUrl: string;
  private categoriesUrl: string;

  private constructor() {
    super('http://localhost:8080/api');
    this.adminUrl = 'http://localhost:8080/api/admin';
    this.categoriesUrl = 'http://localhost:8080/api/categories';
  }

  public static getInstance(): RecipeService {
    if (!RecipeService.instance) {
      RecipeService.instance = new RecipeService();
    }
    return RecipeService.instance;
  }

  // ===========================
  // GET RECIPE BY ID
  // ===========================
  public async getRecipeById(id: number): Promise<AxiosResponse<RecipeResponse>> {
    return this.get<RecipeResponse>(`/recipes/${id}`);
  }

  // ===========================
  // GET MULTIPLE RECIPES BY IDS (BATCH)
  // ===========================
  public async getRecipesByIds(ids: number[]): Promise<AxiosResponse<RecipeResponse[]>> {
    if (ids.length === 0) return Promise.resolve({ data: [] } as AxiosResponse<RecipeResponse[]>);
    const url = this.buildUrl('/recipes/batch', { ids: ids.join(',') });
    return this.get<RecipeResponse[]>(url);
  }



  
  // ===========================
  // GET ALL CATEGORIES (Recipe-based endpoint)
  // ===========================
  public async getAllCategories(): Promise<AxiosResponse<Category[]>> {
    return this.get<Category[]>('/recipes/categories');
  }

  // ===========================
  // GET FOOD CATEGORIES (Separate Categories URL)
  // ===========================
  public async getFoodCategories(): Promise<AxiosResponse<{ name: string; description: string }[]>> {
    try {
      return this.client.get<{ name: string; description: string }[]>(
        `${this.categoriesUrl}/food-categories`
      );
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }

  // ===========================
  // GET ALL RECIPES (Non-paginated)
  // ===========================
  public async getAllRecipes(): Promise<AxiosResponse<RecipeResponse[]>> {
    return this.get<RecipeResponse[]>('/recipes/all');
  }



  
  // ===========================
  // GET ALL RECIPES (Paginated + optional category)
  // ===========================
  public async getAllRecipesPaginated(
    pageNumber: number,
    pageSize: number,
    category?: number
  ): Promise<AxiosResponse<PaginatedRecipes>> {
    const params: Record<string, unknown> = {
      page: pageNumber,
      size: pageSize
    };
    
    if (category !== undefined) {
      params.category = category;
    }

    const url = this.buildUrl('/recipes', params);
    return this.get<PaginatedRecipes>(url);
  }
  // ===========================
  // UPDATE RECIPE AS ADMIN (Consolidated)
  // ===========================
  public async updateRecipeAsAdmin(
    id: number,
    recipeData: RecipeCreateRequest
  ): Promise<AxiosResponse<{ message: string; recipeId: string }>> {
    try {
      return this.client.put<{ message: string; recipeId: string }>(
        `${this.adminUrl}/recipes/${id}`,
        recipeData
      );
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }
  // ===========================
  // CREATE RECIPE
  // ===========================
  public async createRecipe(
    recipe: RecipeCreateRequest
  ): Promise<AxiosResponse<RecipeResponse>> {
    return this.post<RecipeResponse>('/recipes', recipe);
  }

  // ===========================
  // DELETE RECIPE
  // ===========================
  public async deleteRecipe(
    id: number
  ): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/recipes/${id}`);
  }

  // ===========================
  // UPDATE RECIPE
  // ===========================
  public async updateRecipe(
    id: number,
    recipe: RecipeResponse
  ): Promise<AxiosResponse<RecipeResponse>> {
    return this.put<RecipeResponse>(`/recipes/${id}`, recipe);
  }
  // ===========================
  // UPDATE RECIPE STATUS (for non-admin users)
  // ===========================
  public async updateRecipeStatus(
    id: number,
    newStatus: RecipeStatus
  ): Promise<AxiosResponse<UpdateStatusResponse>> {
    return this.put<UpdateStatusResponse>(
      `/recipes/${id}/status`,
      { status: newStatus }
    );
  }



  // ===========================
  // REJECT RECIPE
  // ===========================
  public async rejectRecipe(
    id: number
  ): Promise<AxiosResponse<UpdateStatusResponse>> {
    try {
      return this.client.put<UpdateStatusResponse>(`${this.adminUrl}/recipes/${id}/reject`, {});
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }


  // ===========================
  // SEARCH RECIPES BY TITLE
  // ===========================
  public async searchRecipesByTitle(
    title: string
  ): Promise<AxiosResponse<RecipeResponse[]>> {
    const url = this.buildUrl('/recipes/search', { title });
    return this.get<RecipeResponse[]>(url);
  }

  // ===========================
  // APPROVE RECIPE
  // ===========================
  public async approveRecipe(
    id: number
  ): Promise<AxiosResponse<UpdateStatusResponse>> {
    try {
      return this.client.put<UpdateStatusResponse>(`${this.adminUrl}/recipes/${id}/approve`, {});
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }
  // ===========================
  // GET MY RECIPES
  // ===========================
  public async getMyRecipes(): Promise<AxiosResponse<RecipeResponse[]>> {
    return this.get<RecipeResponse[]>('/recipes/my');
  }

  // ===========================
  // ADMIN METHODS
  // ===========================
  
  public async getPendingRecipes(): Promise<AxiosResponse<RecipeResponse[]>> {
    try {
      return this.client.get<RecipeResponse[]>(`${this.adminUrl}/recipes/pending`);
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }

  public async addRecipeAsAdmin(recipeData: RecipeCreateRequest): Promise<AxiosResponse<{ message: string; recipeId: string }>> {
    try {
      return this.client.post<{ message: string; recipeId: string }>(`${this.adminUrl}/recipes`, recipeData);
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }

  public async getAllRecipesAsAdmin(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt'
  ): Promise<AxiosResponse<PaginatedRecipes>> {
    try {
      const params = { page, size, sortBy };
      const url = this.buildUrl(`${this.adminUrl}/recipes`, params);
      return this.client.get<PaginatedRecipes>(url);
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }

  public async deleteRecipeAsAdmin(id: number): Promise<AxiosResponse<{ message: string }>> {
    try {
      return this.client.delete<{ message: string }>(`${this.adminUrl}/recipes/${id}`);
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }



  
}

export default RecipeService.getInstance();
