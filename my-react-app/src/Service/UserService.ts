import { AxiosResponse } from 'axios';
import { BaseApiService } from './BaseApiService';
import { ErrorHandler } from '../errors/ErrorHandler';
import { User } from '../Models/Recipe';

export interface UpdateUserRequest {
  newEmail?: string;
  newPassword?: string;
}

class UserService extends BaseApiService {
  private static instance: UserService;

  private constructor() {
    super('http://localhost:8080/api');
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
    return this.get<User>('/users');
  }

  // ===========================
  // UPDATE USER DETAILS
  // ===========================
  public async updateUserDetails(
    newEmail?: string,
    newPassword?: string
  ): Promise<AxiosResponse<{ message: string }>> {
    const params: Record<string, unknown> = {};
    if (newEmail) params.newEmail = newEmail;
    if (newPassword) params.newPassword = newPassword;
    
    return this.put<{ message: string }>('/users/update', null, { params });
  }

  // ===========================
  // UPDATE PASSWORD
  // ===========================
  public async updatePassword(newPassword: string): Promise<AxiosResponse<{ message: string }>> {
    return this.put<{ message: string }>('/users/update-password', null, {
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
    return this.post<{ message: string }>(`/users/${userId}/favorites/${recipeId}`, null);
  }

  public async removeFavoriteRecipe(
    userId: number,
    recipeId: number
  ): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/users/${userId}/favorites/${recipeId}`);
  }

  // ===========================
  // ADMIN USER MANAGEMENT
  // ===========================
  public async getAllUsers(): Promise<AxiosResponse<User[]>> {
    try {
      return this.client.get<User[]>('http://localhost:8080/api/admin/users');
    } catch (error) {
      throw ErrorHandler.handleApiError(error);
    }
  }
}

// Export singleton instance
export default UserService.getInstance();

// Export class for type checking
export { UserService };
