// src/Services/RecipeService.ts

import axios, { AxiosResponse } from 'axios';
import { RecipeCreateRequest } from '../Models/RecipeCreateRequest';

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

    public async createRecipe(recipe: RecipeCreateRequest, token: string): Promise<AxiosResponse> {
        const authHeader = `Bearer ${token}`;
        return axios.post(this.baseUrl, recipe, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
        });
    }
}

export default RecipeService.getInstance();
