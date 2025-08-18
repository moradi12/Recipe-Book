import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import UserProfileService, { 
  UserProfile, 
  UserStatistics, 
  UserActivity, 
  UserFollow,
  UserAchievement 
} from '../Service/UserProfileService';
import { notify } from '../Utiles/notif';

export const useUserProfile = (userId?: number) => {
  const { requireAuth, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [activity, setActivity] = useState<UserActivity[]>([]);
  const [followers, setFollowers] = useState<UserFollow[]>([]);
  const [following, setFollowing] = useState<UserFollow[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const targetUserId = userId || user?.id;

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      const [profileRes, statsRes, activityRes, achievementsRes] = await Promise.all([
        UserProfileService.getUserProfile(targetUserId),
        UserProfileService.getUserStatistics(targetUserId),
        UserProfileService.getUserActivity(targetUserId, 10),
        UserProfileService.getUserAchievements(targetUserId)
      ]);

      setProfile(profileRes.data);
      setStatistics(statsRes.data);
      setActivity(activityRes.data);
      setAchievements(achievementsRes.data);

      // Check if current user is following this user (if different users)
      if (user && user.id !== targetUserId) {
        const followStatus = await UserProfileService.isFollowing(targetUserId);
        setIsFollowing(followStatus.data.isFollowing);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Fallback to mock data for development
      setProfile({
        id: targetUserId,
        username: `User${targetUserId}`,
        email: `user${targetUserId}@example.com`,
        userType: 'USER',
        joinDate: new Date().toISOString(),
        bio: 'Food enthusiast and home cook',
        location: 'Kitchen'
      });

      setStatistics({
        totalRecipes: 12,
        totalRatings: 45,
        averageRating: 4.3,
        favoriteRecipes: 28,
        recipesThisMonth: 3,
        totalViews: 1250,
        totalLikes: 89,
        rank: 'Rising Chef',
        joinedDaysAgo: 120
      });

      setActivity([
        {
          id: 1,
          type: 'recipe_created',
          description: 'Created a new recipe: Delicious Pasta',
          timestamp: new Date().toISOString(),
          recipeId: 1,
          recipeTitle: 'Delicious Pasta'
        }
      ]);

      setAchievements([
        {
          id: 1,
          name: 'First Recipe',
          description: 'Created your first recipe',
          icon: '🍳',
          unlockedDate: new Date().toISOString(),
          category: 'recipe'
        }
      ]);

      notify.warning('Using demo data - start backend server for full functionality');
    } finally {
      setLoading(false);
    }
  }, [targetUserId, user]);

  // Fetch followers and following
  const fetchSocialData = useCallback(async () => {
    if (!targetUserId) return;

    try {
      const [followersRes, followingRes] = await Promise.all([
        UserProfileService.getFollowers(targetUserId),
        UserProfileService.getFollowing(targetUserId)
      ]);

      setFollowers(followersRes.data);
      setFollowing(followingRes.data);
    } catch (error) {
      console.error('Error fetching social data:', error);
      // Set mock data
      setFollowers([]);
      setFollowing([]);
    }
  }, [targetUserId]);

  // Toggle follow status
  const toggleFollow = useCallback(async () => {
    if (!requireAuth() || !targetUserId || !user || user.id === targetUserId) return;

    try {
      setFollowLoading(true);
      
      if (isFollowing) {
        await UserProfileService.unfollowUser(targetUserId);
        setIsFollowing(false);
        notify.success(`Unfollowed ${profile?.username}`);
      } else {
        await UserProfileService.followUser(targetUserId);
        setIsFollowing(true);
        notify.success(`Following ${profile?.username}`);
      }

      // Refresh social data
      await fetchSocialData();
    } catch (error) {
      console.error('Error toggling follow:', error);
      notify.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  }, [isFollowing, targetUserId, user, profile?.username, requireAuth, fetchSocialData]);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!requireAuth() || !targetUserId) return false;

    try {
      const response = await UserProfileService.updateUserProfile(targetUserId, updates);
      setProfile(response.data);
      notify.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      notify.error('Failed to update profile');
      return false;
    }
  }, [targetUserId, requireAuth]);

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File) => {
    if (!requireAuth() || !targetUserId) return false;

    try {
      const response = await UserProfileService.uploadUserAvatar(targetUserId, file);
      if (profile) {
        setProfile({ ...profile, avatar: response.data.avatarUrl });
      }
      notify.success('Avatar updated successfully');
      return true;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      notify.error('Failed to upload avatar');
      return false;
    }
  }, [targetUserId, profile, requireAuth]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchSocialData();
  }, [fetchSocialData]);

  return {
    profile,
    statistics,
    activity,
    followers,
    following,
    achievements,
    isFollowing,
    loading,
    followLoading,
    toggleFollow,
    updateProfile,
    uploadAvatar,
    refreshProfile: fetchProfile,
    refreshSocialData: fetchSocialData
  };
};