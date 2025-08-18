import { AxiosResponse } from 'axios';
import { BaseApiService } from './BaseApiService';
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
    super('http://localhost:8080/api/recipes');
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
    return this.get<RecipeResponse>(`/${id}`);
  }



  
  // ===========================
  // GET ALL CATEGORIES (Recipe-based endpoint)
  // ===========================
  public async getAllCategories(): Promise<AxiosResponse<Category[]>> {
    return this.get<Category[]>('/categories');
  }

  // ===========================
  // GET FOOD CATEGORIES (Separate Categories URL)
  // ===========================
  public async getFoodCategories(): Promise<AxiosResponse<{ name: string; description: string }[]>> {
    return this.axiosInstance.get<{ name: string; description: string }[]>(
      `${this.categoriesUrl}/food-categories`
    );
  }

  // ===========================
  // GET ALL RECIPES (Non-paginated)
  // ===========================
  public async getAllRecipes(): Promise<AxiosResponse<RecipeResponse[]>> {
    return this.get<RecipeResponse[]>('/all');
  }



  
  // ===========================
  // GET ALL RECIPES (Paginated + optional category)
  // ===========================
  public async getAllRecipesPaginated(
    pageNumber: number,
    pageSize: number,
    category?: number
  ): Promise<AxiosResponse<PaginatedRecipes>> {
    const params: Record<string, any> = {
      page: pageNumber,
      size: pageSize
    };
    
    if (category !== undefined) {
      params.category = category;
    }

    const url = this.buildUrl('', params);
    return this.get<PaginatedRecipes>(url);
  }
  // ===========================
  // UPDATE RECIPE AS ADMIN (Consolidated)
  // ===========================
  public async updateRecipeAsAdmin(
    id: number,
    recipeData: RecipeCreateRequest
  ): Promise<AxiosResponse<{ message: string; recipeId: string }>> {
    return this.axiosInstance.put<{ message: string; recipeId: string }>(
      `${this.adminUrl}/recipes/${id}`,
      recipeData
    );
  }
  // ===========================
  // CREATE RECIPE
  // ===========================
  public async createRecipe(
    recipe: RecipeCreateRequest
  ): Promise<AxiosResponse<RecipeResponse>> {
    return this.post<RecipeResponse>('', recipe);
  }

  // ===========================
  // DELETE RECIPE
  // ===========================
  public async deleteRecipe(
    id: number
  ): Promise<AxiosResponse<void>> {
    return this.delete<void>(`/${id}`);
  }

  // ===========================
  // UPDATE RECIPE
  // ===========================
  public async updateRecipe(
    id: number,
    recipe: RecipeResponse
  ): Promise<AxiosResponse<RecipeResponse>> {
    return this.put<RecipeResponse>(`/${id}`, recipe);
  }
  // ===========================
  // UPDATE RECIPE STATUS (for non-admin users)
  // ===========================
  public async updateRecipeStatus(
    id: number,
    newStatus: RecipeStatus
  ): Promise<AxiosResponse<UpdateStatusResponse>> {
    return this.put<UpdateStatusResponse>(
      `/${id}/status`,
      { status: newStatus }
    );
  }



  // ===========================
  // REJECT RECIPE
  // ===========================
  public async rejectRecipe(
    id: number
  ): Promise<AxiosResponse<UpdateStatusResponse>> {
    return this.axiosInstance.put<UpdateStatusResponse>(`${this.adminUrl}/recipes/${id}/reject`, {});
  }


  // ===========================
  // SEARCH RECIPES BY TITLE
  // ===========================
  public async searchRecipesByTitle(
    title: string
  ): Promise<AxiosResponse<RecipeResponse[]>> {
    const url = this.buildUrl('/search', { title });
    return this.get<RecipeResponse[]>(url);
  }

  // ===========================
  // APPROVE RECIPE
  // ===========================
  public async approveRecipe(
    id: number
  ): Promise<AxiosResponse<UpdateStatusResponse>> {
    return this.axiosInstance.put<UpdateStatusResponse>(`${this.adminUrl}/recipes/${id}/approve`, {});
  }
  // ===========================
  // GET MY RECIPES
  // ===========================
  public async getMyRecipes(): Promise<AxiosResponse<RecipeResponse[]>> {
    return this.get<RecipeResponse[]>('/my');
  }

  // ===========================
  // ADMIN METHODS
  // ===========================
  
  public async getPendingRecipes(): Promise<AxiosResponse<RecipeResponse[]>> {
    return this.axiosInstance.get<RecipeResponse[]>(`${this.adminUrl}/recipes/pending`);
  }

  public async addRecipeAsAdmin(recipeData: RecipeCreateRequest): Promise<AxiosResponse<{ message: string; recipeId: string }>> {
    return this.axiosInstance.post<{ message: string; recipeId: string }>(`${this.adminUrl}/recipes`, recipeData);
  }

  public async getAllRecipesAsAdmin(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt'
  ): Promise<AxiosResponse<any>> {
    const params = { page, size, sortBy };
    const url = this.buildUrl(`${this.adminUrl}/recipes`, params);
    return this.axiosInstance.get(url);
  }

  public async deleteRecipeAsAdmin(id: number): Promise<AxiosResponse<{ message: string }>> {
    return this.axiosInstance.delete<{ message: string }>(`${this.adminUrl}/recipes/${id}`);
  }



  
}

export default RecipeService.getInstance();
