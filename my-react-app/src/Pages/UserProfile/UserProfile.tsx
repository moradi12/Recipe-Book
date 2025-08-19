import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import TabContent from './TabContent';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { auth: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'recipes' | 'activity' | 'achievements'>('overview');
  
  // Using simplified user data since useUserProfile was removed
  const profile = currentUser;
  const statistics = { recipesCreated: 0, followers: 0, following: 0 };
  const activity = [];
  const followers = [];
  const following = [];
  const achievements = [];
  const isFollowing = false;
  const loading = false;
  const followLoading = false;
  const toggleFollow = () => console.log('Follow functionality to be implemented');

  const isOwnProfile = currentUser && profile && currentUser.id === profile.id;

  if (loading) {
    return (
      <div className="user-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-profile-error">
        <h2>User Not Found</h2>
        <p>The user you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-home">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <ProfileHeader
        profile={profile}
        statistics={statistics}
        followers={followers}
        following={following}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        followLoading={followLoading}
        onToggleFollow={toggleFollow}
      />

      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        statistics={statistics}
        achievements={achievements}
      />

      <TabContent
        activeTab={activeTab}
        profile={profile}
        statistics={statistics}
        activity={activity}
        achievements={achievements}
      />
    </div>
  );
};

export default UserProfile;