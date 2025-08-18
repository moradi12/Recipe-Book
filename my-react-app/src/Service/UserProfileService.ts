import { AxiosResponse } from 'axios';
import { BaseApiService } from './BaseApiService';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  userType: string;
  joinDate?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
}

export interface UserStatistics {
  totalRecipes: number;
  totalRatings: number;
  averageRating: number;
  favoriteRecipes: number;
  recipesThisMonth: number;
  totalViews: number;
  totalLikes: number;
  rank: string;
  joinedDaysAgo: number;
}

export interface UserActivity {
  id: number;
  type: 'recipe_created' | 'recipe_rated' | 'recipe_favorited' | 'user_followed';
  description: string;
  timestamp: string;
  recipeId?: number;
  recipeTitle?: string;
  targetUserId?: number;
  targetUsername?: string;
}

export interface UserFollow {
  id: number;
  followerId: number;
  followingId: number;
  followerUsername: string;
  followingUsername: string;
  followDate: string;
}

export interface UserAchievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlockedDate: string;
  category: 'recipe' | 'social' | 'rating' | 'special';
}

class UserProfileService extends BaseApiService {
  private static instance: UserProfileService;

  private constructor() {
    super('http://localhost:8080/api/users');
  }

  public static getInstance(): UserProfileService {
    if (!UserProfileService.instance) {
      UserProfileService.instance = new UserProfileService();
    }
    return UserProfileService.instance;
  }

  // ===========================
  // USER PROFILE MANAGEMENT
  // ===========================
  
  public async getUserProfile(userId: number): Promise<AxiosResponse<UserProfile>> {
    return this.get<UserProfile>(`/${userId}/profile`);
  }

  public async updateUserProfile(userId: number, profile: Partial<UserProfile>): Promise<AxiosResponse<UserProfile>> {
    return this.put<UserProfile>(`/${userId}/profile`, profile);
  }

  public async uploadUserAvatar(userId: number, avatarFile: File): Promise<AxiosResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return this.post<{ avatarUrl: string }>(`/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  // ===========================
  // USER STATISTICS
  // ===========================

  public async getUserStatistics(userId: number): Promise<AxiosResponse<UserStatistics>> {
    return this.get<UserStatistics>(`/${userId}/statistics`);
  }

  public async getLeaderboard(): Promise<AxiosResponse<UserProfile[]>> {
    return this.get<UserProfile[]>('/leaderboard');
  }

  // ===========================
  // USER ACTIVITY
  // ===========================

  public async getUserActivity(userId: number, limit: number = 20): Promise<AxiosResponse<UserActivity[]>> {
    return this.get<UserActivity[]>(`/${userId}/activity?limit=${limit}`);
  }

  public async getFollowingActivity(limit: number = 50): Promise<AxiosResponse<UserActivity[]>> {
    return this.get<UserActivity[]>(`/activity/following?limit=${limit}`);
  }

  // ===========================
  // SOCIAL FEATURES - FOLLOWING
  // ===========================

  public async followUser(userId: number): Promise<AxiosResponse<{ message: string }>> {
    return this.post<{ message: string }>(`/${userId}/follow`, {});
  }

  public async unfollowUser(userId: number): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/${userId}/follow`);
  }

  public async getFollowers(userId: number): Promise<AxiosResponse<UserFollow[]>> {
    return this.get<UserFollow[]>(`/${userId}/followers`);
  }

  public async getFollowing(userId: number): Promise<AxiosResponse<UserFollow[]>> {
    return this.get<UserFollow[]>(`/${userId}/following`);
  }

  public async isFollowing(userId: number): Promise<AxiosResponse<{ isFollowing: boolean }>> {
    return this.get<{ isFollowing: boolean }>(`/${userId}/following/status`);
  }

  // ===========================
  // USER ACHIEVEMENTS
  // ===========================

  public async getUserAchievements(userId: number): Promise<AxiosResponse<UserAchievement[]>> {
    return this.get<UserAchievement[]>(`/${userId}/achievements`);
  }

  // ===========================
  // USER SEARCH & DISCOVERY
  // ===========================

  public async searchUsers(query: string, limit: number = 20): Promise<AxiosResponse<UserProfile[]>> {
    return this.get<UserProfile[]>(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  public async getSuggestedUsers(limit: number = 10): Promise<AxiosResponse<UserProfile[]>> {
    return this.get<UserProfile[]>(`/suggestions?limit=${limit}`);
  }

  // ===========================
  // NOTIFICATION SYSTEM
  // ===========================

  public async getNotifications(limit: number = 20): Promise<AxiosResponse<any[]>> {
    return this.get<any[]>(`/notifications?limit=${limit}`);
  }

  public async markNotificationAsRead(notificationId: number): Promise<AxiosResponse<{ success: boolean }>> {
    return this.put<{ success: boolean }>(`/notifications/${notificationId}/read`, {});
  }

  public async getUnreadNotificationCount(): Promise<AxiosResponse<{ count: number }>> {
    return this.get<{ count: number }>('/notifications/unread/count');
  }
}

export default UserProfileService.getInstance();
export { UserProfileService };