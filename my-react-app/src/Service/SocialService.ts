import { AxiosResponse } from 'axios';
import { BaseApiService } from './BaseApiService';

export interface SocialUser {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  followerCount: number;
  followingCount: number;
  recipeCount: number;
  isFollowing?: boolean;
  isFollower?: boolean;
}

export interface Follow {
  id: number;
  followerId: number;
  followedId: number;
  createdAt: string;
  followerUser: SocialUser;
  followedUser: SocialUser;
}

export interface SocialActivity {
  id: number;
  userId: number;
  type: 'RECIPE_CREATED' | 'RECIPE_LIKED' | 'USER_FOLLOWED' | 'COLLECTION_CREATED' | 'ACHIEVEMENT_EARNED';
  description: string;
  data?: Record<string, any>;
  createdAt: string;
  user: SocialUser;
}

export interface ShareRecipe {
  id: number;
  recipeId: number;
  sharedByUserId: number;
  sharedWithUserIds: number[];
  message?: string;
  createdAt: string;
  recipeTitle: string;
  sharedByUser: SocialUser;
}

class SocialService extends BaseApiService {
  private static instance: SocialService;

  private constructor() {
    super('http://localhost:8080/api/social');
  }

  public static getInstance(): SocialService {
    if (!SocialService.instance) {
      SocialService.instance = new SocialService();
    }
    return SocialService.instance;
  }

  // ===========================
  // USER FOLLOWING/FOLLOWERS
  // ===========================

  public async followUser(userId: number): Promise<AxiosResponse<Follow>> {
    return this.post<Follow>(`/follow/${userId}`, {});
  }

  public async unfollowUser(userId: number): Promise<AxiosResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/follow/${userId}`);
  }

  public async getFollowers(
    userId: number, 
    page: number = 0, 
    size: number = 20
  ): Promise<AxiosResponse<{
    content: SocialUser[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    return this.get<{
      content: SocialUser[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`/users/${userId}/followers?page=${page}&size=${size}`);
  }

  public async getFollowing(
    userId: number, 
    page: number = 0, 
    size: number = 20
  ): Promise<AxiosResponse<{
    content: SocialUser[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    return this.get<{
      content: SocialUser[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`/users/${userId}/following?page=${page}&size=${size}`);
  }

  public async getFollowStatus(userId: number): Promise<AxiosResponse<{
    isFollowing: boolean;
    isFollower: boolean;
  }>> {
    return this.get<{
      isFollowing: boolean;
      isFollower: boolean;
    }>(`/users/${userId}/follow-status`);
  }

  public async getMutualFollows(userId: number): Promise<AxiosResponse<SocialUser[]>> {
    return this.get<SocialUser[]>(`/users/${userId}/mutual-follows`);
  }

  // ===========================
  // USER DISCOVERY
  // ===========================

  public async getSuggestedUsers(limit: number = 10): Promise<AxiosResponse<SocialUser[]>> {
    return this.get<SocialUser[]>(`/suggested-users?limit=${limit}`);
  }

  public async searchUsers(
    query: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<AxiosResponse<{
    content: SocialUser[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    return this.get<{
      content: SocialUser[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`/search/users?q=${encodeURIComponent(query)}&page=${page}&size=${size}`);
  }

  public async getPopularUsers(limit: number = 10): Promise<AxiosResponse<SocialUser[]>> {
    return this.get<SocialUser[]>(`/popular-users?limit=${limit}`);
  }

  // ===========================
  // ACTIVITY FEED
  // ===========================

  public async getActivityFeed(
    page: number = 0, 
    size: number = 20,
    following_only: boolean = true
  ): Promise<AxiosResponse<{
    content: SocialActivity[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    return this.get<{
      content: SocialActivity[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`/activity-feed?page=${page}&size=${size}&following_only=${following_only}`);
  }

  public async getUserActivity(
    userId: number,
    page: number = 0, 
    size: number = 20
  ): Promise<AxiosResponse<{
    content: SocialActivity[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    return this.get<{
      content: SocialActivity[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`/users/${userId}/activity?page=${page}&size=${size}`);
  }

  // ===========================
  // RECIPE SHARING
  // ===========================

  public async shareRecipe(share: {
    recipeId: number;
    userIds: number[];
    message?: string;
  }): Promise<AxiosResponse<ShareRecipe>> {
    return this.post<ShareRecipe>('/share/recipe', share);
  }

  public async shareRecipeToSocial(share: {
    recipeId: number;
    platform: 'facebook' | 'twitter' | 'instagram' | 'email';
    message?: string;
  }): Promise<AxiosResponse<{ shareUrl: string; message: string }>> {
    return this.post<{ shareUrl: string; message: string }>('/share/recipe/external', share);
  }

  public async getRecipeShares(
    recipeId: number
  ): Promise<AxiosResponse<ShareRecipe[]>> {
    return this.get<ShareRecipe[]>(`/shares/recipe/${recipeId}`);
  }

  public async getMyShares(
    page: number = 0, 
    size: number = 20
  ): Promise<AxiosResponse<{
    content: ShareRecipe[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    return this.get<{
      content: ShareRecipe[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`/shares/my?page=${page}&size=${size}`);
  }

  // ===========================
  // COLLECTION SHARING
  // ===========================

  public async shareCollection(share: {
    collectionId: number;
    userIds: number[];
    message?: string;
  }): Promise<AxiosResponse<{ message: string; sharedCount: number }>> {
    return this.post<{ message: string; sharedCount: number }>('/share/collection', share);
  }

  public async shareCollectionToSocial(share: {
    collectionId: number;
    platform: 'facebook' | 'twitter' | 'instagram' | 'email';
    message?: string;
  }): Promise<AxiosResponse<{ shareUrl: string; message: string }>> {
    return this.post<{ shareUrl: string; message: string }>('/share/collection/external', share);
  }

  // ===========================
  // SOCIAL STATS
  // ===========================

  public async getSocialStats(userId: number): Promise<AxiosResponse<{
    followers: number;
    following: number;
    recipes: number;
    collections: number;
    likes: number;
    totalViews: number;
    engagementRate: number;
  }>> {
    return this.get<{
      followers: number;
      following: number;
      recipes: number;
      collections: number;
      likes: number;
      totalViews: number;
      engagementRate: number;
    }>(`/users/${userId}/stats`);
  }

  // ===========================
  // RECIPE INTERACTIONS
  // ===========================

  public async likeRecipe(recipeId: number): Promise<AxiosResponse<{ isLiked: boolean; likesCount: number }>> {
    return this.post<{ isLiked: boolean; likesCount: number }>(`/recipes/${recipeId}/like`, {});
  }

  public async unlikeRecipe(recipeId: number): Promise<AxiosResponse<{ isLiked: boolean; likesCount: number }>> {
    return this.delete<{ isLiked: boolean; likesCount: number }>(`/recipes/${recipeId}/like`);
  }

  public async getRecipeLikes(recipeId: number): Promise<AxiosResponse<SocialUser[]>> {
    return this.get<SocialUser[]>(`/recipes/${recipeId}/likes`);
  }

  public async commentOnRecipe(recipeId: number, comment: string): Promise<AxiosResponse<{
    id: number;
    comment: string;
    createdAt: string;
    user: SocialUser;
  }>> {
    return this.post<{
      id: number;
      comment: string;
      createdAt: string;
      user: SocialUser;
    }>(`/recipes/${recipeId}/comments`, { comment });
  }

  public async getRecipeComments(recipeId: number): Promise<AxiosResponse<{
    id: number;
    comment: string;
    createdAt: string;
    user: SocialUser;
  }[]>> {
    return this.get<{
      id: number;
      comment: string;
      createdAt: string;
      user: SocialUser;
    }[]>(`/recipes/${recipeId}/comments`);
  }

  // ===========================
  // MESSAGING (Basic)
  // ===========================

  public async sendMessage(message: {
    recipientId: number;
    subject?: string;
    content: string;
  }): Promise<AxiosResponse<{ message: string; messageId: number }>> {
    return this.post<{ message: string; messageId: number }>('/messages/send', message);
  }

  public async getMessages(
    page: number = 0, 
    size: number = 20
  ): Promise<AxiosResponse<{
    content: {
      id: number;
      senderId: number;
      recipientId: number;
      subject?: string;
      content: string;
      isRead: boolean;
      createdAt: string;
      sender: SocialUser;
    }[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    return this.get<{
      content: {
        id: number;
        senderId: number;
        recipientId: number;
        subject?: string;
        content: string;
        isRead: boolean;
        createdAt: string;
        sender: SocialUser;
      }[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`/messages?page=${page}&size=${size}`);
  }

  public async markMessageAsRead(messageId: number): Promise<AxiosResponse<{ message: string }>> {
    return this.put<{ message: string }>(`/messages/${messageId}/read`, {});
  }
}

export default SocialService.getInstance();
export { SocialService };