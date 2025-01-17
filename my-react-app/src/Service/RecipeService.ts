// src/Service/RecipeService.ts

import axios, { AxiosResponse } from 'axios';
import { Category } from '../Models/Category';
import { RecipeResponse } from '../Models/Recipe';
import { RecipeCreateRequest } from '../Models/RecipeCreateRequest';

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
  private categoriesUrl: string = 'http://localhost:8080/api/categories';

  private constructor() {}

  public static getInstance(): RecipeService {
    if (!RecipeService.instance) {
      RecipeService.instance = new RecipeService();
    }
    return RecipeService.instance;
  }

  // ===========================
// GET RECIPE BY ID
// ===========================
// Calls: GET http://localhost:8080/api/recipes/{id}
public async getRecipeById(id: number): Promise<AxiosResponse<RecipeResponse>> {
  return axios.get<RecipeResponse>(`${this.baseUrl}/${id}`);
}




  // ===========================
  // GET ALL CATEGORIES (Recipe-based endpoint)
  // ===========================
  // Calls: GET http://localhost:8080/api/recipes/categories
  // Make sure your backend has @GetMapping("/categories") in RecipeController
  public async getAllCategories(): Promise<AxiosResponse<Category[]>> {
    return axios.get<Category[]>(`${this.baseUrl}/categories`);
  }

  // ===========================
  // GET FOOD CATEGORIES (Separate Categories URL)
  // ===========================
  // Calls: GET http://localhost:8080/api/categories/food-categories
  // Make sure your backend has @GetMapping("/food-categories") in CategoryController
  public async getFoodCategories(): Promise<AxiosResponse<{ name: string; description: string }[]>> {
    return axios.get<{ name: string; description: string }[]>(
      `${this.categoriesUrl}/food-categories`
    );
  }

  // ===========================
  // GET ALL RECIPES (Non-paginated)
  // ===========================
  // Calls: GET http://localhost:8080/api/recipes/all
  public async getAllRecipes(): Promise<AxiosResponse<RecipeResponse[]>> {
    return axios.get<RecipeResponse[]>(`${this.baseUrl}/all`);
  }

  // ===========================
  // GET ALL RECIPES (Paginated + optional category)
  // ===========================
  // Calls: GET http://localhost:8080/api/recipes?page=X&size=Y&category=Z
// GET ALL RECIPES (Paginated + optional category)
// GET ALL RECIPES (Paginated + optional category)
public async getAllRecipesPaginated(
  pageNumber: number,
  pageSize: number,
  category?: number
): Promise<AxiosResponse<PaginatedRecipes>> {
  let url = `${this.baseUrl}?page=${pageNumber}&size=${pageSize}`;

  if (category !== undefined) {
    url += `&category=${encodeURIComponent(String(category))}`;
  }

  return axios.get<PaginatedRecipes>(url);
}
  // ===========================
  // CREATE RECIPE
  // ===========================
  // Calls: POST http://localhost:8080/api/recipes
  public async createRecipe(
    recipe: RecipeCreateRequest,
    token: string
  ): Promise<AxiosResponse<RecipeResponse>> {
    return axios.post<RecipeResponse>(this.baseUrl, recipe, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ===========================
  // DELETE RECIPE
  // ===========================
  // Calls: DELETE http://localhost:8080/api/recipes/{id}
  public async deleteRecipe(
    id: number,
    token: string
  ): Promise<AxiosResponse<void>> {
    return axios.delete(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ===========================
  // UPDATE RECIPE
  // ===========================
  // Calls: PUT http://localhost:8080/api/recipes/{id}
  public async updateRecipe(
    id: number,
    recipe: RecipeResponse,
    token: string
  ): Promise<AxiosResponse<RecipeResponse>> {
    return axios.put<RecipeResponse>(`${this.baseUrl}/${id}`, recipe, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ===========================
  // SEARCH RECIPES BY TITLE
  // ===========================
  // Calls: GET http://localhost:8080/api/recipes/search?title=...
  public async searchRecipesByTitle(
    title: string
  ): Promise<AxiosResponse<RecipeResponse[]>> {
    const url = `${this.baseUrl}/search?title=${encodeURIComponent(title)}`;
    return axios.get<RecipeResponse[]>(url);
  }
}



export default RecipeService.getInstance();
