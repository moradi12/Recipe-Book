import React from 'react';
import { useNavigate } from 'react-router-dom';
import OverviewTab from './OverviewTab';

interface TabContentProps {
  activeTab: 'overview' | 'recipes' | 'activity' | 'achievements';
  profile: any;
  statistics: any;
  activity: any[];
  achievements: any[];
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  profile,
  statistics,
  activity,
  achievements
}) => {
  const navigate = useNavigate();

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
    <div className="profile-content">
      {activeTab === 'overview' && (
        <OverviewTab 
          statistics={statistics}
          activity={activity}
          achievements={achievements}
        />
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
  );
};

export default TabContent;