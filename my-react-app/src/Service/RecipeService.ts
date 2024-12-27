// src/Services/RecipeService.ts
import axios, { AxiosResponse } from 'axios';
import { RecipeResponse } from '../Models/Recipe';

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

  public async createRecipe(recipe: RecipeResponse, token: string): Promise<AxiosResponse<RecipeResponse>> {
    const authHeader = `Bearer ${token}`;
    return axios.post(this.baseUrl, recipe, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    });
  }

  public async getAllRecipes(): Promise<AxiosResponse<RecipeResponse[]>> {
    return axios.get(`${this.baseUrl}/all`);
  }
}

export default RecipeService.getInstance();
