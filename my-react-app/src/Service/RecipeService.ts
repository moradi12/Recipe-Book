import axios, { AxiosResponse } from 'axios';
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
  // ... any other fields from the backend response
}

class RecipeService {
  private static instance: RecipeService;
  // Base URL for recipe-related endpoints (non-admin)
  private baseUrl: string = 'http://localhost:8080/api/recipes';
  // Base URL for admin endpoints (for actions like approving recipes)
  private adminUrl: string = 'http://localhost:8080/api/admin';
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



  
  // ==================
  // =========
  // GET ALL CATEGORIES (Recipe-based endpoint)
  // ===========================
  // Calls: GET http://localhost:8080/api/recipes/categories
  public async getAllCategories(): Promise<AxiosResponse<Category[]>> {
    return axios.get<Category[]>(`${this.baseUrl}/categories`);
  }

  // ===========================
  // GET FOOD CATEGORIES (Separate Categories URL)
  // ===========================
  // Calls: GET http://localhost:8080/api/categories/food-categories
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
// Add below your other methods
public async updateRecipeAsAdminn(
  id: number,
  recipeData: RecipeCreateRequest,
  token: string
): Promise<AxiosResponse<{ message: string; recipeId: string }>> {
  // This calls your ADMIN endpoint
  return axios.put<{ message: string; recipeId: string }>(
    `${this.adminUrl}/recipes/${id}`, 
    recipeData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

// Right after updateRecipe(...)
public async updateRecipeAsAdmin(
  id: number,
  recipeCreateRequest: RecipeCreateRequest,
  token: string
): Promise<AxiosResponse<{ message: string; recipeId: string }>> {
  try {
    return await axios.put<{ message: string; recipeId: string }>(
      `${this.adminUrl}/recipes/${id}`,
      recipeCreateRequest,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error updating recipe:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Error updating recipe:", error);
    }
    throw error;
  }
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
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // ===========================
// UPDATE RECIPE STATUS (for non-admin users)
// ===========================
// Calls: PUT http://localhost:8080/api/recipes/{id}/status
public async updateRecipeStatus(
  id: number,
  newStatus: RecipeStatus,
  token: string
): Promise<AxiosResponse<UpdateStatusResponse>> {
  return axios.put<UpdateStatusResponse>(
    `${this.baseUrl}/${id}/status`,
    { status: newStatus },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}



  // ===========================
  // REJECT RECIPE
  // ===========================
  // Calls: PUT http://localhost:8080/api/admin/recipes/{id}/reject
  public async rejectRecipe(
    id: number,
    token: string
  ): Promise<AxiosResponse<UpdateStatusResponse>> {
    return axios.put<UpdateStatusResponse>(`${this.adminUrl}/recipes/${id}/reject`, {}, {
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

// ===========================
// APPROVE RECIPE
// ===========================
// Calls: PUT http://localhost:8080/api/admin/recipes/{id}/approve
public async approveRecipe(
  id: number,
  token: string
): Promise<AxiosResponse<UpdateStatusResponse>> {
  console.log("Approving recipe", id, "with token:", token); // Debugging log
  return axios.put(`${this.adminUrl}/recipes/${id}/approve`, {}, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}
public async getMyRecipes(token: string): Promise<AxiosResponse<RecipeResponse[]>> {
  return axios.get<RecipeResponse[]>(`${this.baseUrl}/my`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}



  
}

export default RecipeService.getInstance();
