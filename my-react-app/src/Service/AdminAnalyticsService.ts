import { AxiosResponse } from 'axios';
import { BaseApiService } from './BaseApiService';

export interface DashboardStats {
  totalUsers: number;
  totalRecipes: number;
  totalCollections: number;
  pendingRecipes: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  activeUsersMonth: number;
  averageRecipesPerUser: number;
  averageRating: number;
}

export interface UserGrowthData {
  date: string;
  newUsers: number;
  totalUsers: number;
  activeUsers: number;
}

export interface RecipeAnalytics {
  date: string;
  recipesCreated: number;
  recipesApproved: number;
  recipesDenied: number;
  totalRecipes: number;
  averageRating: number;
  totalViews: number;
  totalLikes: number;
}

export interface PopularContent {
  id: number;
  title: string;
  type: 'recipe' | 'collection' | 'user';
  views: number;
  likes: number;
  shares: number;
  createdAt: string;
  createdBy: string;
  score: number;
}

export interface UserActivity {
  userId: number;
  username: string;
  email: string;
  recipesCreated: number;
  collectionsCreated: number;
  likesGiven: number;
  commentsPosted: number;
  lastActivity: string;
  registrationDate: string;
  isActive: boolean;
  userType: 'USER' | 'ADMIN' | 'MODERATOR';
}

export interface ContentModeration {
  id: number;
  type: 'recipe' | 'comment' | 'collection';
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'FLAGGED';
  flagReason?: string;
  moderatorId?: number;
  moderatedAt?: string;
  moderatorNotes?: string;
  reportCount: number;
}

export interface SystemHealth {
  serverStatus: 'HEALTHY' | 'WARNING' | 'ERROR';
  databaseStatus: 'HEALTHY' | 'WARNING' | 'ERROR';
  apiResponseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  activeConnections: number;
  errorRate: number;
  uptime: number;
  lastBackup: string;
}

export interface EngagementMetrics {
  date: string;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
  pageViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  retentionRate: number;
}

class AdminAnalyticsService extends BaseApiService {
  private static instance: AdminAnalyticsService;

  private constructor() {
    super('http://localhost:8080/api/admin');
  }

  public static getInstance(): AdminAnalyticsService {
    if (!AdminAnalyticsService.instance) {
      AdminAnalyticsService.instance = new AdminAnalyticsService();
    }
    return AdminAnalyticsService.instance;
  }

  // ===========================
  // DASHBOARD OVERVIEW
  // ===========================

  public async getDashboardStats(): Promise<AxiosResponse<DashboardStats>> {
    return this.get<DashboardStats>('/dashboard/stats');
  }

  public async getSystemHealth(): Promise<AxiosResponse<SystemHealth>> {
    return this.get<SystemHealth>('/system/health');
  }

  // ===========================
  // USER ANALYTICS
  // ===========================

  public async getUserGrowth(
    period: 'day' | 'week' | 'month' | 'year' = 'month',
    limit: number = 30
  ): Promise<AxiosResponse<UserGrowthData[]>> {
    return this.get<UserGrowthData[]>(`/analytics/user-growth?period=${period}&limit=${limit}`);
  }

  public async getUserActivity(
    page: number = 0,
    size: number = 20,
    sortBy: string = 'lastActivity',
    sortDir: 'asc' | 'desc' = 'desc'
  ): Promise<AxiosResponse<{
    content: UserActivity[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    return this.get<{
      content: UserActivity[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`/users/activity?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  public async getEngagementMetrics(
    startDate: string,
    endDate: string
  ): Promise<AxiosResponse<EngagementMetrics[]>> {
    return this.get<EngagementMetrics[]>(
      `/analytics/engagement?startDate=${startDate}&endDate=${endDate}`
    );
  }

  // ===========================
  // CONTENT ANALYTICS
  // ===========================

  public async getRecipeAnalytics(
    period: 'day' | 'week' | 'month' | 'year' = 'month',
    limit: number = 30
  ): Promise<AxiosResponse<RecipeAnalytics[]>> {
    return this.get<RecipeAnalytics[]>(`/analytics/recipes?period=${period}&limit=${limit}`);
  }

  public async getPopularContent(
    type: 'all' | 'recipe' | 'collection' | 'user' = 'all',
    period: 'day' | 'week' | 'month' | 'all' = 'week',
    limit: number = 10
  ): Promise<AxiosResponse<PopularContent[]>> {
    return this.get<PopularContent[]>(`/analytics/popular?type=${type}&period=${period}&limit=${limit}`);
  }

  // ===========================
  // CONTENT MODERATION
  // ===========================

  public async getPendingModeration(
    type?: 'recipe' | 'comment' | 'collection',
    page: number = 0,
    size: number = 20
  ): Promise<AxiosResponse<{
    content: ContentModeration[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    const typeParam = type ? `&type=${type}` : '';
    return this.get<{
      content: ContentModeration[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`/moderation/pending?page=${page}&size=${size}${typeParam}`);
  }

  public async moderateContent(
    contentId: number,
    action: 'approve' | 'deny' | 'flag',
    notes?: string,
    flagReason?: string
  ): Promise<AxiosResponse<ContentModeration>> {
    return this.post<ContentModeration>(`/moderation/${contentId}/${action}`, {
      notes,
      flagReason
    });
  }

  public async getFlaggedContent(
    page: number = 0,
    size: number = 20
  ): Promise<AxiosResponse<{
    content: ContentModeration[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    return this.get<{
      content: ContentModeration[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`/moderation/flagged?page=${page}&size=${size}`);
  }

  // ===========================
  // USER MANAGEMENT
  // ===========================

  public async getAllUsers(
    page: number = 0,
    size: number = 20,
    search?: string,
    userType?: 'USER' | 'ADMIN' | 'MODERATOR',
    status?: 'active' | 'inactive' | 'banned'
  ): Promise<AxiosResponse<{
    content: UserActivity[];
    totalElements: number;
    totalPages: number;
    last: boolean;
  }>> {
    let params = `page=${page}&size=${size}`;
    if (search) params += `&search=${encodeURIComponent(search)}`;
    if (userType) params += `&userType=${userType}`;
    if (status) params += `&status=${status}`;
    
    return this.get<{
      content: UserActivity[];
      totalElements: number;
      totalPages: number;
      last: boolean;
    }>(`/users?${params}`);
  }

  public async updateUserStatus(
    userId: number,
    status: 'active' | 'inactive' | 'banned',
    reason?: string
  ): Promise<AxiosResponse<{ message: string }>> {
    return this.put<{ message: string }>(`/users/${userId}/status`, {
      status,
      reason
    });
  }

  public async updateUserRole(
    userId: number,
    role: 'USER' | 'ADMIN' | 'MODERATOR'
  ): Promise<AxiosResponse<{ message: string }>> {
    return this.put<{ message: string }>(`/users/${userId}/role`, { role });
  }

  // ===========================
  // REPORTING & EXPORT
  // ===========================

  public async generateReport(
    reportType: 'users' | 'recipes' | 'engagement' | 'content',
    startDate: string,
    endDate: string,
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<AxiosResponse<any>> {
    return this.get<any>(
      `/reports/${reportType}?startDate=${startDate}&endDate=${endDate}&format=${format}`
    );
  }

  public async exportData(
    dataType: 'users' | 'recipes' | 'collections' | 'analytics',
    format: 'json' | 'csv' | 'excel' = 'csv',
    filters?: Record<string, any>
  ): Promise<AxiosResponse<Blob>> {
    const filterParams = filters ? '&' + new URLSearchParams(filters).toString() : '';
    return this.get<Blob>(
      `/export/${dataType}?format=${format}${filterParams}`,
      { responseType: 'blob' }
    );
  }

  // ===========================
  // NOTIFICATIONS & ALERTS
  // ===========================

  public async getAdminNotifications(): Promise<AxiosResponse<{
    alerts: Array<{
      id: number;
      type: 'error' | 'warning' | 'info';
      message: string;
      timestamp: string;
      resolved: boolean;
    }>;
    unreadCount: number;
  }>> {
    return this.get<{
      alerts: Array<{
        id: number;
        type: 'error' | 'warning' | 'info';
        message: string;
        timestamp: string;
        resolved: boolean;
      }>;
      unreadCount: number;
    }>('/notifications');
  }

  public async resolveAlert(alertId: number): Promise<AxiosResponse<{ message: string }>> {
    return this.put<{ message: string }>(`/notifications/${alertId}/resolve`, {});
  }

  // ===========================
  // CONFIGURATION
  // ===========================

  public async getSystemConfig(): Promise<AxiosResponse<{
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
    moderationEnabled: boolean;
    maxFileUploadSize: number;
    allowedFileTypes: string[];
    rateLimit: number;
    sessionTimeout: number;
  }>> {
    return this.get<{
      maintenanceMode: boolean;
      registrationEnabled: boolean;
      emailVerificationRequired: boolean;
      moderationEnabled: boolean;
      maxFileUploadSize: number;
      allowedFileTypes: string[];
      rateLimit: number;
      sessionTimeout: number;
    }>('/config');
  }

  public async updateSystemConfig(config: {
    maintenanceMode?: boolean;
    registrationEnabled?: boolean;
    emailVerificationRequired?: boolean;
    moderationEnabled?: boolean;
    maxFileUploadSize?: number;
    allowedFileTypes?: string[];
    rateLimit?: number;
    sessionTimeout?: number;
  }): Promise<AxiosResponse<{ message: string }>> {
    return this.put<{ message: string }>('/config', config);
  }
}

export default AdminAnalyticsService.getInstance();
export { AdminAnalyticsService };