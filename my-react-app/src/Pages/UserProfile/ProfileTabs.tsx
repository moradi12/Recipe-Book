import React from 'react';

interface ProfileTabsProps {
  activeTab: 'overview' | 'recipes' | 'activity' | 'achievements';
  onTabChange: (tab: 'overview' | 'recipes' | 'activity' | 'achievements') => void;
  statistics: any;
  achievements: any[];
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
  statistics,
  achievements
}) => {
  return (
    <div className="profile-navigation">
      <nav className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => onTabChange('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => onTabChange('recipes')}
        >
          Recipes ({statistics?.totalRecipes || 0})
        </button>
        <button 
          className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => onTabChange('activity')}
        >
          Activity
        </button>
        <button 
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => onTabChange('achievements')}
        >
          Achievements ({achievements.length})
        </button>
      </nav>
    </div>
  );
};

export default ProfileTabs;