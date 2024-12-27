// src/Services/RecipeService.ts
import axios, { AxiosResponse } from 'axios';
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

  // Creates a recipe
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

  // Unpaginated array fetch (if you need it for your Redux slice)
  public async getAllRecipes(): Promise<AxiosResponse<RecipeResponse[]>> {
    return axios.get<RecipeResponse[]>(`${this.baseUrl}/all`);
  }

  // PAGINATED fetch
  public async getAllRecipesPaginated(
    pageNumber: number,
    pageSize: number
  ): Promise<AxiosResponse<PaginatedRecipes>> {
    return axios.get<PaginatedRecipes>(
      `${this.baseUrl}/all?page=${pageNumber}&size=${pageSize}`
    );
  }
}

export default RecipeService.getInstance();
