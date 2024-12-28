// src/Services/RecipeService.ts
import axios, { AxiosResponse } from 'axios';
import { Category } from '../Models/Category';
import { RecipeResponse } from '../Models/Recipe';

export interface PaginatedRecipes {
  content: RecipeResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  // ... any other fields from the backend response
}

class RecipeService {
  private static instance: RecipeService;
  private baseUrl: string = 'http://localhost:8080/api/recipes';

  private constructor() {}

  public static getInstance(): RecipeService {
    if (!RecipeService.instance) {
      RecipeService.instance = new RecipeService();
    }
    return RecipeService.instance;
  }

  /**
   * Creates a new recipe.
   * @param recipe - Recipe object to create.
   * @param token - Authorization token.
   */
  public async createRecipe(
    recipe: RecipeResponse,
    token: string
  ): Promise<AxiosResponse<RecipeResponse>> {
    const authHeader = `Bearer ${token}`;
    return axios.post<RecipeResponse>(this.baseUrl, recipe, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });
  }

  /**
   * Fetches all recipes without pagination.
   */
  public async getAllRecipes(): Promise<AxiosResponse<RecipeResponse[]>> {
    return axios.get<RecipeResponse[]>(`${this.baseUrl}/all`);
  }

  /**
   * Fetches paginated recipes with optional category filter.
   * @param pageNumber - Page number to fetch.
   * @param pageSize - Number of items per page.
   * @param category - (Optional) Category filter.
   */
  public async getAllRecipesPaginated(
    pageNumber: number,
    pageSize: number,
    category?: string
  ): Promise<AxiosResponse<PaginatedRecipes>> {
    const url = `${this.baseUrl}/all?page=${pageNumber}&size=${pageSize}`;
    const finalUrl = category ? `${url}&category=${encodeURIComponent(category)}` : url;

    return axios.get<PaginatedRecipes>(finalUrl);
  }

  /**
   * Fetches all categories.
   */
  public async getAllCategories(): Promise<AxiosResponse<Category[]>> {
    try {
      const response = await axios.get<Category[]>(`${this.baseUrl}/categories`);
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
  
  /**
   * Deletes a recipe by ID.
   * @param id - Recipe ID to delete.
   * @param token - Authorization token.
   */
  public async deleteRecipe(id: number, token: string): Promise<AxiosResponse<void>> {
    const authHeader = `Bearer ${token}`;
    return axios.delete(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: authHeader,
      },
    });
  }

  /**
   * Updates a recipe by ID.
   * @param id - Recipe ID to update.
   * @param recipe - Updated recipe data.
   * @param token - Authorization token.
   */
  public async updateRecipe(
    id: number,
    recipe: RecipeResponse,
    token: string
  ): Promise<AxiosResponse<RecipeResponse>> {
    const authHeader = `Bearer ${token}`;
    return axios.put<RecipeResponse>(`${this.baseUrl}/${id}`, recipe, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });
  }

  /**
   * Searches for recipes by title.
   * @param title - Recipe title to search.
   */
  public async searchRecipesByTitle(title: string): Promise<AxiosResponse<RecipeResponse[]>> {
    const url = `${this.baseUrl}/search?title=${encodeURIComponent(title)}`;
    return axios.get<RecipeResponse[]>(url);
  }
}

export default RecipeService.getInstance();
