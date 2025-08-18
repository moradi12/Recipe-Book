/**
 * Unified API Service - Single point of access for all API operations
 * This provides a clean, consolidated interface for the entire application
 */

import RecipeService from './RecipeService';
import UserService from './UserService';
import FavoriteService from './FavoriteService';
import AuthService from '../Utiles/authService';

class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // ===========================
  // RECIPE OPERATIONS
  // ===========================
  public get recipes() {
    return RecipeService;
  }

  // ===========================
  // USER OPERATIONS
  // ===========================
  public get users() {
    return UserService;
  }

  // ===========================
  // FAVORITE OPERATIONS
  // ===========================
  public get favorites() {
    return FavoriteService;
  }

  // ===========================
  // AUTH OPERATIONS
  // ===========================
  public get auth() {
    return AuthService;
  }
}

// Export singleton instance
export default ApiService.getInstance();

// Export individual services for direct access if needed
export {
  RecipeService,
  UserService,
  FavoriteService,
  AuthService
};