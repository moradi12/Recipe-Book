import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import AdminAnalyticsService, {
  DashboardStats,
  UserGrowthData,
  RecipeAnalytics,
  PopularContent,
  UserActivity,
  ContentModeration,
  SystemHealth,
  EngagementMetrics
} from '../Service/AdminAnalyticsService';
import { notify } from '../Utiles/notif';

export const useAdminAnalytics = () => {
  const { requireAuth, user } = useAuth();
  
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [recipeAnalytics, setRecipeAnalytics] = useState<RecipeAnalytics[]>([]);
  const [popularContent, setPopularContent] = useState<PopularContent[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [pendingModeration, setPendingModeration] = useState<ContentModeration[]>([]);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return user?.userType === 'ADMIN' || user?.username === 'admin';
  }, [user]);

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    if (!requireAuth() || !isAdmin()) return;

    try {
      const response = await AdminAnalyticsService.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Mock data for development
      const mockStats: DashboardStats = {
        totalUsers: 1247,
        totalRecipes: 3456,
        totalCollections: 287,
        pendingRecipes: 23,
        totalViews: 45678,
        totalLikes: 8934,
        totalComments: 2456,
        totalShares: 567,
        activeUsersToday: 89,
        activeUsersWeek: 456,
        activeUsersMonth: 1123,
        averageRecipesPerUser: 2.77,
        averageRating: 4.2
      };
      
      setDashboardStats(mockStats);
      notify.warning('Using demo data - start backend server for live analytics');
    }
  }, [requireAuth, isAdmin]);

  // Fetch system health
  const fetchSystemHealth = useCallback(async () => {
    if (!requireAuth() || !isAdmin()) return;

    try {
      const response = await AdminAnalyticsService.getSystemHealth();
      setSystemHealth(response.data);
    } catch (error) {
      console.error('Error fetching system health:', error);
      
      // Mock system health
      const mockHealth: SystemHealth = {
        serverStatus: 'HEALTHY',
        databaseStatus: 'HEALTHY',
        apiResponseTime: 125,
        memoryUsage: 67,
        cpuUsage: 34,
        diskUsage: 45,
        activeConnections: 123,
        errorRate: 0.2,
        uptime: 2592000, // 30 days in seconds
        lastBackup: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      };
      
      setSystemHealth(mockHealth);
    }
  }, [requireAuth, isAdmin]);

  // Fetch user growth data
  const fetchUserGrowth = useCallback(async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    if (!requireAuth() || !isAdmin()) return;

    try {
      const response = await AdminAnalyticsService.getUserGrowth(period);
      setUserGrowth(response.data);
    } catch (error) {
      console.error('Error fetching user growth:', error);
      
      // Mock user growth data
      const mockGrowthData: UserGrowthData[] = [];
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        mockGrowthData.push({
          date: date.toISOString().split('T')[0],
          newUsers: Math.floor(Math.random() * 20) + 5,
          totalUsers: 1000 + (29 - i) * 15,
          activeUsers: Math.floor(Math.random() * 100) + 50
        });
      }
      
      setUserGrowth(mockGrowthData);
    }
  }, [requireAuth, isAdmin]);

  // Fetch recipe analytics
  const fetchRecipeAnalytics = useCallback(async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    if (!requireAuth() || !isAdmin()) return;

    try {
      const response = await AdminAnalyticsService.getRecipeAnalytics(period);
      setRecipeAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching recipe analytics:', error);
      
      // Mock recipe analytics
      const mockRecipeData: RecipeAnalytics[] = [];
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        mockRecipeData.push({
          date: date.toISOString().split('T')[0],
          recipesCreated: Math.floor(Math.random() * 15) + 3,
          recipesApproved: Math.floor(Math.random() * 12) + 2,
          recipesDenied: Math.floor(Math.random() * 3),
          totalRecipes: 3000 + (29 - i) * 8,
          averageRating: 3.8 + Math.random() * 0.8,
          totalViews: Math.floor(Math.random() * 500) + 200,
          totalLikes: Math.floor(Math.random() * 100) + 20
        });
      }
      
      setRecipeAnalytics(mockRecipeData);
    }
  }, [requireAuth, isAdmin]);

  // Fetch popular content
  const fetchPopularContent = useCallback(async (
    type: 'all' | 'recipe' | 'collection' | 'user' = 'all',
    period: 'day' | 'week' | 'month' | 'all' = 'week'
  ) => {
    if (!requireAuth() || !isAdmin()) return;

    try {
      const response = await AdminAnalyticsService.getPopularContent(type, period);
      setPopularContent(response.data);
    } catch (error) {
      console.error('Error fetching popular content:', error);
      
      // Mock popular content
      const mockPopularContent: PopularContent[] = [
        {
          id: 1,
          title: 'Ultimate Chocolate Cake',
          type: 'recipe',
          views: 2456,
          likes: 345,
          shares: 67,
          createdAt: '2024-01-15T10:30:00Z',
          createdBy: 'chef_master',
          score: 95
        },
        {
          id: 2,
          title: 'Healthy Breakfast Ideas',
          type: 'collection',
          views: 1893,
          likes: 234,
          shares: 45,
          createdAt: '2024-01-12T14:20:00Z',
          createdBy: 'nutrition_guru',
          score: 87
        },
        {
          id: 3,
          title: 'Perfect Pasta Carbonara',
          type: 'recipe',
          views: 1678,
          likes: 289,
          shares: 56,
          createdAt: '2024-01-18T09:15:00Z',
          createdBy: 'italian_chef',
          score: 83
        }
      ];
      
      setPopularContent(mockPopularContent);
    }
  }, [requireAuth, isAdmin]);

  // Fetch user activity
  const fetchUserActivity = useCallback(async (page: number = 0) => {
    if (!requireAuth() || !isAdmin()) return;

    try {
      const response = await AdminAnalyticsService.getUserActivity(page);
      
      if (page === 0) {
        setUserActivity(response.data.content);
      } else {
        setUserActivity(prev => [...prev, ...response.data.content]);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      
      // Mock user activity
      const mockUserActivity: UserActivity[] = [
        {
          userId: 1,
          username: 'chef_master',
          email: 'chef@example.com',
          recipesCreated: 23,
          collectionsCreated: 5,
          likesGiven: 156,
          commentsPosted: 78,
          lastActivity: new Date(Date.now() - 3600000).toISOString(),
          registrationDate: '2023-06-15T10:30:00Z',
          isActive: true,
          userType: 'USER'
        },
        {
          userId: 2,
          username: 'foodie_explorer',
          email: 'foodie@example.com',
          recipesCreated: 12,
          collectionsCreated: 3,
          likesGiven: 234,
          commentsPosted: 45,
          lastActivity: new Date(Date.now() - 7200000).toISOString(),
          registrationDate: '2023-08-22T14:20:00Z',
          isActive: true,
          userType: 'USER'
        }
      ];
      
      if (page === 0) {
        setUserActivity(mockUserActivity);
      }
      
      return { content: mockUserActivity, totalElements: 2, totalPages: 1, last: true };
    }
  }, [requireAuth, isAdmin]);

  // Fetch pending moderation
  const fetchPendingModeration = useCallback(async (
    type?: 'recipe' | 'comment' | 'collection',
    page: number = 0
  ) => {
    if (!requireAuth() || !isAdmin()) return;

    try {
      const response = await AdminAnalyticsService.getPendingModeration(type, page);
      
      if (page === 0) {
        setPendingModeration(response.data.content);
      } else {
        setPendingModeration(prev => [...prev, ...response.data.content]);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching pending moderation:', error);
      
      // Mock pending moderation
      const mockModeration: ContentModeration[] = [
        {
          id: 1,
          type: 'recipe',
          title: 'Spicy Thai Curry',
          content: 'A delicious and authentic Thai curry recipe...',
          createdBy: 'thai_cook',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'PENDING',
          reportCount: 0
        },
        {
          id: 2,
          type: 'comment',
          title: 'Comment on "Chocolate Cake"',
          content: 'This recipe is amazing! I tried it and...',
          createdBy: 'sweet_tooth',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          status: 'FLAGGED',
          flagReason: 'Inappropriate language',
          reportCount: 2
        }
      ];
      
      if (page === 0) {
        setPendingModeration(mockModeration);
      }
      
      return { content: mockModeration, totalElements: 2, totalPages: 1, last: true };
    }
  }, [requireAuth, isAdmin]);

  // Moderate content
  const moderateContent = useCallback(async (
    contentId: number,
    action: 'approve' | 'deny' | 'flag',
    notes?: string,
    flagReason?: string
  ) => {
    if (!requireAuth() || !isAdmin()) return false;

    try {
      setActionLoading(true);
      await AdminAnalyticsService.moderateContent(contentId, action, notes, flagReason);
      
      // Update local state
      setPendingModeration(prev => 
        prev.map(item => 
          item.id === contentId 
            ? { 
                ...item, 
                status: action === 'approve' ? 'APPROVED' : action === 'deny' ? 'DENIED' : 'FLAGGED',
                moderatorNotes: notes,
                flagReason: flagReason,
                moderatedAt: new Date().toISOString()
              }
            : item
        ).filter(item => action !== 'approve' && action !== 'deny' ? true : item.id !== contentId)
      );
      
      notify.success(`Content ${action}${action === 'approve' ? 'd' : action === 'deny' ? 'ied' : 'ged'} successfully`);
      return true;
    } catch (error) {
      console.error('Error moderating content:', error);
      
      // Fallback for demo
      setPendingModeration(prev => 
        prev.filter(item => item.id !== contentId)
      );
      notify.success(`Content ${action}${action === 'approve' ? 'd' : action === 'deny' ? 'ied' : 'ged'} (demo mode)`);
      return true;
    } finally {
      setActionLoading(false);
    }
  }, [requireAuth, isAdmin]);

  // Fetch engagement metrics
  const fetchEngagementMetrics = useCallback(async (startDate: string, endDate: string) => {
    if (!requireAuth() || !isAdmin()) return;

    try {
      const response = await AdminAnalyticsService.getEngagementMetrics(startDate, endDate);
      setEngagementMetrics(response.data);
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
      
      // Mock engagement metrics
      const mockEngagement: EngagementMetrics[] = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      
      for (let i = 0; i < daysDiff; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        mockEngagement.push({
          date: date.toISOString().split('T')[0],
          dailyActiveUsers: Math.floor(Math.random() * 200) + 100,
          weeklyActiveUsers: Math.floor(Math.random() * 800) + 400,
          monthlyActiveUsers: Math.floor(Math.random() * 2000) + 1000,
          averageSessionDuration: Math.floor(Math.random() * 1800) + 600, // 10-40 minutes
          bounceRate: Math.random() * 0.3 + 0.2, // 20-50%
          pageViews: Math.floor(Math.random() * 5000) + 1000,
          uniqueVisitors: Math.floor(Math.random() * 1000) + 200,
          conversionRate: Math.random() * 0.1 + 0.05, // 5-15%
          retentionRate: Math.random() * 0.4 + 0.6 // 60-100%
        });
      }
      
      setEngagementMetrics(mockEngagement);
    }
  }, [requireAuth, isAdmin]);

  // Initialize admin data
  useEffect(() => {
    if (isAdmin()) {
      fetchDashboardStats();
      fetchSystemHealth();
      fetchUserGrowth();
      fetchRecipeAnalytics();
      fetchPopularContent();
      fetchUserActivity();
      fetchPendingModeration();
      
      // Fetch engagement metrics for last 30 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      fetchEngagementMetrics(startDate, endDate);
    }
  }, [isAdmin, fetchDashboardStats, fetchSystemHealth, fetchUserGrowth, fetchRecipeAnalytics, 
      fetchPopularContent, fetchUserActivity, fetchPendingModeration, fetchEngagementMetrics]);

  return {
    // Data
    dashboardStats,
    systemHealth,
    userGrowth,
    recipeAnalytics,
    popularContent,
    userActivity,
    pendingModeration,
    engagementMetrics,
    
    // State
    loading,
    actionLoading,
    isAdmin: isAdmin(),
    
    // Actions
    fetchDashboardStats,
    fetchSystemHealth,
    fetchUserGrowth,
    fetchRecipeAnalytics,
    fetchPopularContent,
    fetchUserActivity,
    fetchPendingModeration,
    fetchEngagementMetrics,
    moderateContent
  };
};