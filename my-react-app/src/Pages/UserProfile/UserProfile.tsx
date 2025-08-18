import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuth } from '../../hooks/useAuth';
import './UserProfile.css';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'recipes' | 'activity' | 'achievements'>('overview');
  
  const {
    profile,
    statistics,
    activity,
    followers,
    following,
    achievements,
    isFollowing,
    loading,
    followLoading,
    toggleFollow
  } = useUserProfile(userId ? parseInt(userId) : undefined);

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

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'master chef': return '#ff6b6b';
      case 'expert cook': return '#4ecdc4';
      case 'rising chef': return '#45b7d1';
      case 'home cook': return '#96ceb4';
      default: return '#74b9ff';
    }
  };

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'recipe': return '🍳';
      case 'social': return '👥';
      case 'rating': return '⭐';
      case 'special': return '🏆';
      default: return '🎯';
    }
  };

  return (
    <div className="user-profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-banner">
          <div className="profile-main-info">
            <div className="profile-avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.username} />
              ) : (
                <div className="avatar-placeholder">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
              {statistics && (
                <div 
                  className="user-rank-badge"
                  style={{ backgroundColor: getRankColor(statistics.rank) }}
                >
                  {statistics.rank}
                </div>
              )}
            </div>

            <div className="profile-details">
              <h1 className="profile-username">{profile.username}</h1>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              
              <div className="profile-meta">
                {profile.location && (
                  <span className="meta-item">
                    📍 {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a href={profile.website} className="meta-item website-link" target="_blank" rel="noopener noreferrer">
                    🌐 Website
                  </a>
                )}
                {statistics && (
                  <span className="meta-item">
                    📅 Joined {statistics.joinedDaysAgo} days ago
                  </span>
                )}
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-number">{statistics?.totalRecipes || 0}</span>
                  <span className="stat-label">Recipes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{followers.length}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{following.length}</span>
                  <span className="stat-label">Following</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{statistics?.averageRating.toFixed(1) || '0.0'}</span>
                  <span className="stat-label">Avg Rating</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {isOwnProfile ? (
                <button 
                  className="btn-edit-profile"
                  onClick={() => navigate('/profile/edit')}
                >
                  Edit Profile
                </button>
              ) : (
                <button 
                  className={`btn-follow ${isFollowing ? 'following' : ''}`}
                  onClick={toggleFollow}
                  disabled={followLoading}
                >
                  {followLoading ? '...' : (isFollowing ? 'Following' : 'Follow')}
                </button>
              )}
              
              <button 
                className="btn-message"
                onClick={() => navigate(`/messages/${profile.id}`)}
              >
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="profile-navigation">
        <nav className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            Recipes ({statistics?.totalRecipes || 0})
          </button>
          <button 
            className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
          <button 
            className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements ({achievements.length})
          </button>
        </nav>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              {/* Statistics Cards */}
              <div className="stats-section">
                <h3>Statistics</h3>
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-icon">🍳</div>
                    <div className="stat-info">
                      <span className="stat-value">{statistics?.totalRecipes || 0}</span>
                      <span className="stat-name">Total Recipes</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                      <span className="stat-value">{statistics?.totalRatings || 0}</span>
                      <span className="stat-name">Ratings Given</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">❤️</div>
                    <div className="stat-info">
                      <span className="stat-value">{statistics?.favoriteRecipes || 0}</span>
                      <span className="stat-name">Favorites</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">👀</div>
                    <div className="stat-info">
                      <span className="stat-value">{statistics?.totalViews || 0}</span>
                      <span className="stat-name">Profile Views</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="activity-section">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {activity.length > 0 ? (
                    activity.slice(0, 5).map((item) => (
                      <div key={item.id} className="activity-item">
                        <div className="activity-icon">
                          {item.type === 'recipe_created' ? '🍳' : 
                           item.type === 'recipe_rated' ? '⭐' : 
                           item.type === 'recipe_favorited' ? '❤️' : '👥'}
                        </div>
                        <div className="activity-content">
                          <span className="activity-description">{item.description}</span>
                          <span className="activity-time">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-activity">No recent activity</p>
                  )}
                </div>
              </div>

              {/* Top Achievements */}
              <div className="achievements-preview">
                <h3>Latest Achievements</h3>
                <div className="achievements-grid">
                  {achievements.slice(0, 6).map((achievement) => (
                    <div key={achievement.id} className="achievement-card">
                      <div className="achievement-icon">
                        {getAchievementIcon(achievement.category)}
                      </div>
                      <div className="achievement-info">
                        <span className="achievement-name">{achievement.name}</span>
                        <span className="achievement-date">
                          {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="recipes-tab">
            <div className="recipes-header">
              <h3>{profile.username}'s Recipes</h3>
              <button onClick={() => navigate(`/recipes?user=${profile.id}`)} className="view-all-btn">
                View All Recipes
              </button>
            </div>
            <div className="coming-soon">
              <p>Recipe grid component will be implemented next...</p>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-tab">
            <h3>Activity Timeline</h3>
            <div className="activity-timeline">
              {activity.map((item) => (
                <div key={item.id} className="timeline-item">
                  <div className="timeline-marker">
                    {item.type === 'recipe_created' ? '🍳' : 
                     item.type === 'recipe_rated' ? '⭐' : 
                     item.type === 'recipe_favorited' ? '❤️' : '👥'}
                  </div>
                  <div className="timeline-content">
                    <p className="timeline-description">{item.description}</p>
                    <span className="timeline-time">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-tab">
            <h3>All Achievements</h3>
            <div className="achievements-full-grid">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="achievement-full-card">
                  <div className="achievement-header">
                    <span className="achievement-big-icon">
                      {getAchievementIcon(achievement.category)}
                    </span>
                    <div className="achievement-details">
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                    </div>
                  </div>
                  <div className="achievement-footer">
                    <span className="achievement-category">{achievement.category}</span>
                    <span className="achievement-unlock-date">
                      Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;