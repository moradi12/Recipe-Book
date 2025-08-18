import { AxiosResponse } from 'axios';
import { BaseApiService } from './BaseApiService';
import { User } from '../Models/Recipe';

export interface UpdateUserRequest {
  newEmail?: string;
  newPassword?: string;
}

class UserService extends BaseApiService {
  private static instance: UserService;

  private constructor() {
    super('http://localhost:8080/api/users');
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // ===========================
  // GET CURRENT USER
  // ===========================
  public async getCurrentUser(): Promise<AxiosResponse<User>> {
    return this.get<User>('');
  }

  // ===========================
  // UPDATE USER DETAILS
  // ===========================
  public async updateUserDetails(
    newEmail?: string,
    newPassword?: string
  ): Promise<AxiosResponse<{ message: string }>> {
    const params: Record<string, any> = {};
    if (newEmail) params.newEmail = newEmail;
    if (newPassword) params.newPassword = newPassword;
    
    return this.put<{ message: string }>('/update', null, { params });
  }

  // ===========================
  // UPDATE PASSWORD
  // ===========================
  public async updatePassword(newPassword: string): Promise<AxiosResponse<{ message: string }>> {
    return this.put<{ message: string }>('/update-password', null, {
      params: { newPassword }
    });
  }

  // ===========================
  // FAVORITE RECIPE MANAGEMENT
  // ===========================
  public async addFavoriteRecipe(
    userId: number,
    recipeId: number
  ): Promise<AxiosResponse<{ message: string }>> {
    return this.post<{ message: string }>(`/${userId}/favorites/${recipeId}`, null);
  }

  public async removeFavoriteRecipe(
    userId: number,
    recipeId: number
  ): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/${userId}/favorites/${recipeId}`);
  }

  // ===========================
  // ADMIN USER MANAGEMENT
  // ===========================
  public async getAllUsers(): Promise<AxiosResponse<User[]>> {
    return this.axiosInstance.get<User[]>('http://localhost:8080/api/admin/users');
  }
}

// Export singleton instance
export default UserService.getInstance();

// Export class for type checking
export { UserService };
