import { AxiosResponse } from 'axios';
import { BaseApiService } from './BaseApiService';
import { Favorite } from '../Models/Favorite';

class FavoriteService extends BaseApiService {
  private static instance: FavoriteService;

  private constructor() {
    super('http://localhost:8080/api/favorites');
  }

  public static getInstance(): FavoriteService {
    if (!FavoriteService.instance) {
      FavoriteService.instance = new FavoriteService();
    }
    return FavoriteService.instance;
  }

  // GET /api/favorites - Get all favorites for the logged-in user
  public async getFavorites(): Promise<AxiosResponse<Favorite[]>> {
    return this.get<Favorite[]>('');
  }

  // POST /api/favorites/{recipeId} - Add a recipe to favorites
  public async addFavorite(recipeId: number): Promise<AxiosResponse<string>> {
    return this.post<string>(`/${recipeId}`, {});
  }

  // DELETE /api/favorites/{recipeId} - Remove a recipe from favorites
  public async removeFavorite(recipeId: number): Promise<AxiosResponse<string>> {
    return this.delete<string>(`/${recipeId}`);
  }
}

export default FavoriteService.getInstance();
export { FavoriteService };