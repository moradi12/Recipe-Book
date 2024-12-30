// src/Service/RecipeService.ts

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
  private categoriesUrl: string = 'http://localhost:8080/api/categories';
  private constructor() {}

  public static getInstance(): RecipeService {
    if (!RecipeService.instance) {
      RecipeService.instance = new RecipeService();
    }
    return RecipeService.instance;
  }


   // ===========================
  // GET FOOD CATEGORIES
  // ===========================
  public async getFoodCategories(): Promise<AxiosResponse<{ name: string; description: string }[]>> {
    return axios.get<{ name: string; description: string }[]>(`${this.categoriesUrl}/food-categories`);
  }

  // ===========================
  // GET ALL RECIPES
  // ===========================
  public async getAllRecipes(): Promise<AxiosResponse<RecipeResponse[]>> {
    return axios.get<RecipeResponse[]>(`${this.baseUrl}/all`);
  }

  // ===========================
  // CREATE
  // ===========================
  public async createRecipe(
    recipe: RecipeResponse,
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
  // GET PAGINATED
  // ===========================
  public async getAllRecipesPaginated(
    pageNumber: number,
    pageSize: number,
    category?: string
  ): Promise<AxiosResponse<PaginatedRecipes>> {
    let url = `${this.baseUrl}?page=${pageNumber}&size=${pageSize}`;

    if (category) {
      // This works if your backend supports filtering by category
      url += `&category=${encodeURIComponent(category)}`;
    }
    return axios.get<PaginatedRecipes>(url);
  }

  // ===========================
  // GET CATEGORIES (Public Endpoint)
  // ===========================
  public async getAllCategories(): Promise<AxiosResponse<Category[]>> {
    return axios.get<Category[]>(`${this.baseUrl}/categories`); // Public endpoint
  }

  // ===========================
  // DELETE
  // ===========================
  public async deleteRecipe(id: number, token: string): Promise<AxiosResponse<void>> {
    return axios.delete(`${this.baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // ===========================
  // UPDATE
  // ===========================
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
  // SEARCH
  // ===========================
  public async searchRecipesByTitle(title: string): Promise<AxiosResponse<RecipeResponse[]>> {
    const url = `${this.baseUrl}/search?title=${encodeURIComponent(title)}`;
    return axios.get<RecipeResponse[]>(url);
  }
}


export default RecipeService.getInstance();
