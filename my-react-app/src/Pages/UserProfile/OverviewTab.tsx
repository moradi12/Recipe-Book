import React from 'react';

interface OverviewTabProps {
  statistics: any;
  activity: any[];
  achievements: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  statistics,
  activity,
  achievements
}) => {
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
  );
};

export default OverviewTab;