import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import SocialService, { SocialUser, SocialActivity } from '../Service/SocialService';
import { useNotifications } from './useNotifications';
import { notify } from '../Utiles/notif';

export const useSocial = () => {
  const { requireAuth, isAuthenticated } = useAuth();
  const { notifyNewFollower, notifyRecipeLike, notifyRecipeComment } = useNotifications();
  
  const [followers, setFollowers] = useState<SocialUser[]>([]);
  const [following, setFollowing] = useState<SocialUser[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SocialUser[]>([]);
  const [activityFeed, setActivityFeed] = useState<SocialActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Follow/Unfollow user
  const toggleFollow = useCallback(async (userId: number, isCurrentlyFollowing: boolean) => {
    if (!requireAuth()) return false;

    try {
      setActionLoading(true);
      
      if (isCurrentlyFollowing) {
        await SocialService.unfollowUser(userId);
        setFollowing(prev => prev.filter(user => user.id !== userId));
        notify.success('Unfollowed user');
      } else {
        await SocialService.followUser(userId);
        setFollowing(prev => [...prev, { id: userId } as SocialUser]);
        
        // Send notification to the followed user
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.id) {
          await notifyNewFollower(userId, currentUser.id);
        }
        
        notify.success('Now following user');
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling follow:', error);
      
      // Fallback for demo
      if (isCurrentlyFollowing) {
        setFollowing(prev => prev.filter(user => user.id !== userId));
        notify.success('Unfollowed user (demo mode)');
      } else {
        setFollowing(prev => [...prev, { id: userId } as SocialUser]);
        notify.success('Now following user (demo mode)');
      }
      return true;
    } finally {
      setActionLoading(false);
    }
  }, [requireAuth, notifyNewFollower]);

  // Get follow status for a user
  const getFollowStatus = useCallback(async (userId: number) => {
    if (!requireAuth()) return { isFollowing: false, isFollower: false };

    try {
      const response = await SocialService.getFollowStatus(userId);
      return response.data;
    } catch (error) {
      console.error('Error getting follow status:', error);
      return { isFollowing: false, isFollower: false };
    }
  }, [requireAuth]);

  // Fetch followers
  const fetchFollowers = useCallback(async (userId: number, page: number = 0) => {
    try {
      setLoading(true);
      const response = await SocialService.getFollowers(userId, page);
      
      if (page === 0) {
        setFollowers(response.data.content);
      } else {
        setFollowers(prev => [...prev, ...response.data.content]);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching followers:', error);
      
      // Mock data for demo
      const mockFollowers: SocialUser[] = [
        {
          id: 2,
          username: 'chef_master',
          email: 'chef@example.com',
          profileImage: '/images/avatars/chef.jpg',
          bio: 'Professional chef with 10+ years experience',
          followerCount: 1250,
          followingCount: 340,
          recipeCount: 89,
          isFollowing: true
        },
        {
          id: 3,
          username: 'foodie_explorer',
          email: 'foodie@example.com',
          bio: 'Love trying new cuisines from around the world',
          followerCount: 890,
          followingCount: 567,
          recipeCount: 45,
          isFollowing: false
        }
      ];

      if (page === 0) {
        setFollowers(mockFollowers);
      }
      
      return { content: mockFollowers, totalElements: 2, totalPages: 1, last: true };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch following
  const fetchFollowing = useCallback(async (userId: number, page: number = 0) => {
    try {
      setLoading(true);
      const response = await SocialService.getFollowing(userId, page);
      
      if (page === 0) {
        setFollowing(response.data.content);
      } else {
        setFollowing(prev => [...prev, ...response.data.content]);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching following:', error);
      
      // Mock data for demo
      const mockFollowing: SocialUser[] = [
        {
          id: 4,
          username: 'baking_queen',
          email: 'baker@example.com',
          bio: 'Specializing in artisan breads and pastries',
          followerCount: 2340,
          followingCount: 180,
          recipeCount: 67,
          isFollowing: true
        },
        {
          id: 5,
          username: 'pasta_pro',
          email: 'pasta@example.com',
          bio: 'Italian cuisine enthusiast',
          followerCount: 1560,
          followingCount: 234,
          recipeCount: 56,
          isFollowing: true
        }
      ];

      if (page === 0) {
        setFollowing(mockFollowing);
      }
      
      return { content: mockFollowing, totalElements: 2, totalPages: 1, last: true };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch suggested users
  const fetchSuggestedUsers = useCallback(async (limit: number = 10) => {
    if (!requireAuth()) return;

    try {
      const response = await SocialService.getSuggestedUsers(limit);
      setSuggestedUsers(response.data);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
      
      // Mock suggestions
      setSuggestedUsers([
        {
          id: 6,
          username: 'healthy_lifestyle',
          email: 'healthy@example.com',
          bio: 'Nutritionist sharing healthy recipe ideas',
          followerCount: 3200,
          followingCount: 450,
          recipeCount: 124,
          isFollowing: false
        },
        {
          id: 7,
          username: 'dessert_master',
          email: 'dessert@example.com',
          bio: 'Creating sweet masterpieces daily',
          followerCount: 1890,
          followingCount: 290,
          recipeCount: 78,
          isFollowing: false
        },
        {
          id: 8,
          username: 'grill_guru',
          email: 'grill@example.com',
          bio: 'BBQ and grilling specialist',
          followerCount: 2150,
          followingCount: 320,
          recipeCount: 92,
          isFollowing: false
        }
      ]);
    }
  }, [requireAuth]);

  // Fetch activity feed
  const fetchActivityFeed = useCallback(async (page: number = 0, followingOnly: boolean = true) => {
    if (!requireAuth()) return;

    try {
      setLoading(true);
      const response = await SocialService.getActivityFeed(page, 20, followingOnly);
      
      if (page === 0) {
        setActivityFeed(response.data.content);
      } else {
        setActivityFeed(prev => [...prev, ...response.data.content]);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      
      // Mock activity feed
      const mockActivity: SocialActivity[] = [
        {
          id: 1,
          userId: 2,
          type: 'RECIPE_CREATED',
          description: 'chef_master created a new recipe: "Truffle Risotto"',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          user: {
            id: 2,
            username: 'chef_master',
            email: 'chef@example.com',
            followerCount: 1250,
            followingCount: 340,
            recipeCount: 89
          },
          data: { recipeId: 123, recipeName: 'Truffle Risotto' }
        },
        {
          id: 2,
          userId: 4,
          type: 'ACHIEVEMENT_EARNED',
          description: 'baking_queen earned the "Master Baker" achievement',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          user: {
            id: 4,
            username: 'baking_queen',
            email: 'baker@example.com',
            followerCount: 2340,
            followingCount: 180,
            recipeCount: 67
          },
          data: { achievementType: 'Master Baker', level: 'gold' }
        },
        {
          id: 3,
          userId: 5,
          type: 'COLLECTION_CREATED',
          description: 'pasta_pro created a new collection: "Authentic Italian Pasta"',
          createdAt: new Date(Date.now() - 10800000).toISOString(),
          user: {
            id: 5,
            username: 'pasta_pro',
            email: 'pasta@example.com',
            followerCount: 1560,
            followingCount: 234,
            recipeCount: 56
          },
          data: { collectionId: 45, collectionName: 'Authentic Italian Pasta' }
        }
      ];

      if (page === 0) {
        setActivityFeed(mockActivity);
      }
      
      return { content: mockActivity, totalElements: 3, totalPages: 1, last: true };
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  // Like recipe
  const likeRecipe = useCallback(async (recipeId: number) => {
    if (!requireAuth()) return false;

    try {
      const response = await SocialService.likeRecipe(recipeId);
      
      // Notify recipe owner
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id) {
        await notifyRecipeLike(recipeId, currentUser.id);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error liking recipe:', error);
      
      // Fallback for demo
      const mockResponse = { isLiked: true, likesCount: Math.floor(Math.random() * 50) + 1 };
      notify.success('Recipe liked!');
      return mockResponse;
    }
  }, [requireAuth, notifyRecipeLike]);

  // Unlike recipe
  const unlikeRecipe = useCallback(async (recipeId: number) => {
    if (!requireAuth()) return false;

    try {
      const response = await SocialService.unlikeRecipe(recipeId);
      return response.data;
    } catch (error) {
      console.error('Error unliking recipe:', error);
      
      // Fallback for demo
      const mockResponse = { isLiked: false, likesCount: Math.floor(Math.random() * 50) };
      notify.success('Recipe unliked');
      return mockResponse;
    }
  }, [requireAuth]);

  // Comment on recipe
  const commentOnRecipe = useCallback(async (recipeId: number, comment: string) => {
    if (!requireAuth()) return false;

    try {
      const response = await SocialService.commentOnRecipe(recipeId, comment);
      
      // Notify recipe owner
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.id) {
        await notifyRecipeComment(recipeId, currentUser.id, comment);
      }
      
      notify.success('Comment added');
      return response.data;
    } catch (error) {
      console.error('Error commenting on recipe:', error);
      
      // Fallback for demo
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const mockComment = {
        id: Date.now(),
        comment,
        createdAt: new Date().toISOString(),
        user: {
          id: currentUser.id || 1,
          username: currentUser.username || 'current_user',
          email: currentUser.email || 'user@example.com',
          followerCount: 0,
          followingCount: 0,
          recipeCount: 0
        }
      };
      
      notify.success('Comment added (demo mode)');
      return mockComment;
    }
  }, [requireAuth, notifyRecipeComment]);

  // Share recipe
  const shareRecipe = useCallback(async (recipeId: number, userIds: number[], message?: string) => {
    if (!requireAuth()) return false;

    try {
      const response = await SocialService.shareRecipe({ recipeId, userIds, message });
      notify.success('Recipe shared successfully');
      return response.data;
    } catch (error) {
      console.error('Error sharing recipe:', error);
      notify.success('Recipe shared (demo mode)');
      return true;
    }
  }, [requireAuth]);

  // Search users
  const searchUsers = useCallback(async (query: string, page: number = 0) => {
    try {
      const response = await SocialService.searchUsers(query, page);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      
      // Mock search results
      const mockResults: SocialUser[] = [
        {
          id: 9,
          username: `${query}_user1`,
          email: 'search1@example.com',
          bio: `User matching "${query}"`,
          followerCount: 150,
          followingCount: 80,
          recipeCount: 12,
          isFollowing: false
        }
      ];
      
      return { content: mockResults, totalElements: 1, totalPages: 1, last: true };
    }
  }, []);

  // Initialize social data
  useEffect(() => {
    if (isAuthenticated()) {
      fetchSuggestedUsers();
      fetchActivityFeed();
    }
  }, [isAuthenticated, fetchSuggestedUsers, fetchActivityFeed]);

  return {
    followers,
    following,
    suggestedUsers,
    activityFeed,
    loading,
    actionLoading,
    toggleFollow,
    getFollowStatus,
    fetchFollowers,
    fetchFollowing,
    fetchSuggestedUsers,
    fetchActivityFeed,
    likeRecipe,
    unlikeRecipe,
    commentOnRecipe,
    shareRecipe,
    searchUsers
  };
};