import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
  profile: any;
  statistics: any;
  followers: any[];
  following: any[];
  isOwnProfile: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  onToggleFollow: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  statistics,
  followers,
  following,
  isOwnProfile,
  isFollowing,
  followLoading,
  onToggleFollow
}) => {
  const navigate = useNavigate();

  const getRankColor = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'master chef': return '#ff6b6b';
      case 'expert cook': return '#4ecdc4';
      case 'rising chef': return '#45b7d1';
      case 'home cook': return '#96ceb4';
      default: return '#74b9ff';
    }
  };

  return (
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
                onClick={onToggleFollow}
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
  );
};

export default ProfileHeader;