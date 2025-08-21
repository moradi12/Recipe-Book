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

  // ===========================
  // GET FAVORITES
  // ===========================
  public async getFavorites(): Promise<AxiosResponse<Favorite[]>> {
    return this.get<Favorite[]>('');
  }

  // ===========================
  // ADD FAVORITE
  // ===========================
  public async addFavorite(recipeId: number): Promise<AxiosResponse<{ message: string }>> {
    console.log('Adding favorite for recipe ID:', recipeId);
    console.log('Token in localStorage:', localStorage.getItem('token'));
    console.log('Token in sessionStorage:', sessionStorage.getItem('jwt'));
    return this.post<{ message: string }>(`/${recipeId}`, {});
  }

  // ===========================
  // REMOVE FAVORITE
  // ===========================
  public async removeFavorite(recipeId: number): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/${recipeId}`);
  }
}

export default FavoriteService.getInstance();
export { FavoriteService };
