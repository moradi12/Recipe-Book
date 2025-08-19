import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './NotificationCenter.css';

const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [showPreferences, setShowPreferences] = useState(false);

  // Simplified notifications data since useNotifications was removed
  const notifications = [];
  const unreadCount = 0;
  const loading = false;
  const actionLoading = false;
  const preferences = { emailNotifications: true, pushNotifications: true };
  const markAsRead = () => console.log('Mark as read to be implemented');
  const markAllAsRead = () => console.log('Mark all as read to be implemented');
  const deleteNotification = () => console.log('Delete notification to be implemented');
  const clearAllNotifications = () => console.log('Clear all notifications to be implemented');
  const updatePreferences = () => console.log('Update preferences to be implemented');

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'RECIPE_LIKE':
      case 'RECIPE_COMMENT':
        if (notification.relatedRecipeId) {
          navigate(`/recipes/${notification.relatedRecipeId}`);
        }
        break;
      case 'FOLLOW':
        if (notification.relatedUserId) {
          navigate(`/profile/${notification.relatedUserId}`);
        }
        break;
      case 'COLLECTION_SHARE':
        if (notification.data?.collectionId) {
          navigate(`/collections/${notification.data.collectionId}`);
        }
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'RECIPE_LIKE': return '❤️';
      case 'RECIPE_COMMENT': return '💬';
      case 'FOLLOW': return '👥';
      case 'COLLECTION_SHARE': return '📚';
      case 'ACHIEVEMENT': return '🏆';
      case 'MEAL_PLAN_REMINDER': return '🗓️';
      default: return '🔔';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    if (preferences) {
      updatePreferences({ [key]: value });
    }
  };

  if (!requireAuth()) {
    return (
      <div className="notification-center-page">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to view your notifications.</p>
          <button onClick={() => navigate('/login')} className="btn-login">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="notification-center-page">
        <div className="notifications-loading">
          <div className="loading-spinner"></div>
          <p>Loading your notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-center-page">
      {/* Header */}
      <div className="notifications-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </div>
          <div className="header-actions">
            <button 
              className="btn-preferences"
              onClick={() => setShowPreferences(!showPreferences)}
              title="Notification Settings"
            >
              ⚙️ Settings
            </button>
            {unreadCount > 0 && (
              <button 
                className="btn-mark-all-read"
                onClick={markAllAsRead}
                disabled={actionLoading}
              >
                Mark All Read
              </button>
            )}
            <button 
              className="btn-clear-all"
              onClick={clearAllNotifications}
              disabled={actionLoading}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="notifications-navigation">
        <nav className="notification-tabs">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({notifications.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread ({unreadCount})
          </button>
        </nav>
      </div>

      <div className="notifications-content">
        {/* Preferences Panel */}
        {showPreferences && preferences && (
          <div className="preferences-panel">
            <h3>Notification Preferences</h3>
            <div className="preferences-grid">
              <div className="preference-group">
                <h4>Delivery Methods</h4>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  />
                  Email notifications
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.pushNotifications}
                    onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                  />
                  Browser notifications
                </label>
              </div>

              <div className="preference-group">
                <h4>Notification Types</h4>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.recipeLikes}
                    onChange={(e) => handlePreferenceChange('recipeLikes', e.target.checked)}
                  />
                  Recipe likes
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.recipeComments}
                    onChange={(e) => handlePreferenceChange('recipeComments', e.target.checked)}
                  />
                  Recipe comments
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.newFollowers}
                    onChange={(e) => handlePreferenceChange('newFollowers', e.target.checked)}
                  />
                  New followers
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.collectionShares}
                    onChange={(e) => handlePreferenceChange('collectionShares', e.target.checked)}
                  />
                  Collection shares
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.achievements}
                    onChange={(e) => handlePreferenceChange('achievements', e.target.checked)}
                  />
                  Achievement unlocks
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={preferences.mealPlanReminders}
                    onChange={(e) => handlePreferenceChange('mealPlanReminders', e.target.checked)}
                  />
                  Meal plan reminders
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <div className="empty-icon">🔔</div>
            <h3>
              {activeTab === 'unread' 
                ? 'No unread notifications' 
                : 'No notifications yet'
              }
            </h3>
            <p>
              {activeTab === 'unread'
                ? 'You\'re all caught up! Check back later for new updates.'
                : 'When you get notifications, they\'ll appear here.'
              }
            </p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <h4 className="notification-title">{notification.title}</h4>
                    <span className="notification-time">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  {notification.relatedUserUsername && (
                    <div className="notification-meta">
                      <span className="related-user">@{notification.relatedUserUsername}</span>
                      {notification.relatedRecipeTitle && (
                        <span className="related-recipe">• {notification.relatedRecipeTitle}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="notification-actions">
                  {!notification.isRead && (
                    <button
                      className="btn-mark-read"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    title="Delete notification"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;