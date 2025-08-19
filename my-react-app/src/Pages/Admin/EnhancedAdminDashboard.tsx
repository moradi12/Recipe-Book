import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAdmin } from '../../hooks/useAdmin';
import './EnhancedAdminDashboard.css';

const EnhancedAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { isAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'moderation' | 'system'>('overview');
  const [chartPeriod, setChartPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // Simplified admin analytics data since useAdminAnalytics was removed
  const dashboardStats = { totalUsers: 0, totalRecipes: 0, pendingApproval: 0, todayActivity: 0 };
  const systemHealth = { status: 'healthy', uptime: '99.9%', responseTime: '120ms' };
  const userGrowth = [];
  const recipeAnalytics = [];
  const popularContent = [];
  const userActivity = [];
  const pendingModeration = [];
  const engagementMetrics = { likes: 0, shares: 0, comments: 0, favorites: 0 };
  const loading = false;
  const actionLoading = false;
  const moderateContent = () => console.log('Moderate content to be implemented');
  const fetchUserGrowth = () => console.log('Fetch user growth to be implemented');
  const fetchRecipeAnalytics = () => console.log('Fetch recipe analytics to be implemented');

  if (!requireAuth()) {
    return (
      <div className="admin-dashboard-page">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to access the admin dashboard.</p>
          <button onClick={() => navigate('/login')} className="btn-login">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-dashboard-page">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
          <button onClick={() => navigate('/')} className="btn-home">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const handlePeriodChange = (period: 'day' | 'week' | 'month' | 'year') => {
    setChartPeriod(period);
    fetchUserGrowth(period);
    fetchRecipeAnalytics(period);
  };

  const handleModeration = async (
    contentId: number,
    action: 'approve' | 'deny' | 'flag',
    notes?: string
  ) => {
    await moderateContent(contentId, action, notes);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return '#4CAF50';
      case 'WARNING': return '#FF9800';
      case 'ERROR': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <select 
              value={chartPeriod} 
              onChange={(e) => handlePeriodChange(e.target.value as any)}
              className="period-selector"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-navigation">
        <nav className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="tab-icon">📊</span>
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="tab-icon">👥</span>
            Users
          </button>
          <button 
            className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <span className="tab-icon">📝</span>
            Content
          </button>
          <button 
            className={`tab-button ${activeTab === 'moderation' ? 'active' : ''}`}
            onClick={() => setActiveTab('moderation')}
          >
            <span className="tab-icon">🛡️</span>
            Moderation
            {pendingModeration.length > 0 && (
              <span className="notification-badge">{pendingModeration.length}</span>
            )}
          </button>
          <button 
            className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <span className="tab-icon">⚙️</span>
            System
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Key Metrics Cards */}
            {dashboardStats && (
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">👥</div>
                  <div className="metric-info">
                    <div className="metric-value">{formatNumber(dashboardStats.totalUsers)}</div>
                    <div className="metric-label">Total Users</div>
                    <div className="metric-change">+{dashboardStats.activeUsersToday} today</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">📝</div>
                  <div className="metric-info">
                    <div className="metric-value">{formatNumber(dashboardStats.totalRecipes)}</div>
                    <div className="metric-label">Total Recipes</div>
                    <div className="metric-change">⏳ {dashboardStats.pendingRecipes} pending</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">📚</div>
                  <div className="metric-info">
                    <div className="metric-value">{formatNumber(dashboardStats.totalCollections)}</div>
                    <div className="metric-label">Collections</div>
                    <div className="metric-change">Avg {dashboardStats.averageRecipesPerUser.toFixed(1)} per user</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">❤️</div>
                  <div className="metric-info">
                    <div className="metric-value">{formatNumber(dashboardStats.totalLikes)}</div>
                    <div className="metric-label">Total Likes</div>
                    <div className="metric-change">⭐ {dashboardStats.averageRating.toFixed(1)} avg rating</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">👀</div>
                  <div className="metric-info">
                    <div className="metric-value">{formatNumber(dashboardStats.totalViews)}</div>
                    <div className="metric-label">Total Views</div>
                    <div className="metric-change">💬 {formatNumber(dashboardStats.totalComments)} comments</div>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">📤</div>
                  <div className="metric-info">
                    <div className="metric-value">{formatNumber(dashboardStats.totalShares)}</div>
                    <div className="metric-label">Total Shares</div>
                    <div className="metric-change">🏃 {dashboardStats.activeUsersWeek} active this week</div>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Section */}
            <div className="charts-section">
              <div className="chart-container">
                <h3>User Growth</h3>
                <div className="simple-chart">
                  {userGrowth.slice(-7).map((data, index) => (
                    <div key={index} className="chart-bar">
                      <div 
                        className="bar" 
                        style={{ 
                          height: `${(data.newUsers / Math.max(...userGrowth.map(d => d.newUsers))) * 100}%` 
                        }}
                        title={`${data.newUsers} new users on ${data.date}`}
                      ></div>
                      <div className="bar-label">{new Date(data.date).getDate()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-container">
                <h3>Recipe Analytics</h3>
                <div className="simple-chart">
                  {recipeAnalytics.slice(-7).map((data, index) => (
                    <div key={index} className="chart-bar">
                      <div 
                        className="bar recipe-bar" 
                        style={{ 
                          height: `${(data.recipesCreated / Math.max(...recipeAnalytics.map(d => d.recipesCreated))) * 100}%` 
                        }}
                        title={`${data.recipesCreated} recipes created on ${data.date}`}
                      ></div>
                      <div className="bar-label">{new Date(data.date).getDate()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Content */}
            <div className="popular-content-section">
              <h3>Popular Content This Week</h3>
              <div className="content-list">
                {popularContent.map((content) => (
                  <div key={content.id} className="content-item">
                    <div className="content-icon">
                      {content.type === 'recipe' ? '📝' : content.type === 'collection' ? '📚' : '👤'}
                    </div>
                    <div className="content-info">
                      <h4>{content.title}</h4>
                      <p>by {content.createdBy}</p>
                      <div className="content-stats">
                        <span>👀 {formatNumber(content.views)}</span>
                        <span>❤️ {formatNumber(content.likes)}</span>
                        <span>📤 {formatNumber(content.shares)}</span>
                      </div>
                    </div>
                    <div className="content-score">
                      <div className="score-circle">
                        {content.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="tab-header">
              <h2>User Management</h2>
            </div>

            <div className="user-activity-list">
              {userActivity.map((user) => (
                <div key={user.userId} className="user-activity-item">
                  <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h4>{user.username}</h4>
                    <p>{user.email}</p>
                    <div className="user-stats">
                      <span>📝 {user.recipesCreated} recipes</span>
                      <span>📚 {user.collectionsCreated} collections</span>
                      <span>❤️ {user.likesGiven} likes given</span>
                    </div>
                  </div>
                  <div className="user-meta">
                    <div className={`user-status ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </div>
                    <div className="user-type">{user.userType}</div>
                    <div className="last-activity">
                      Last seen: {new Date(user.lastActivity).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="content-tab">
            <div className="tab-header">
              <h2>Content Analytics</h2>
            </div>

            <div className="content-metrics">
              <div className="metric-row">
                <div className="metric-item">
                  <span className="metric-label">Total Recipes:</span>
                  <span className="metric-value">{dashboardStats?.totalRecipes || 0}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Total Collections:</span>
                  <span className="metric-value">{dashboardStats?.totalCollections || 0}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Average Rating:</span>
                  <span className="metric-value">⭐ {dashboardStats?.averageRating.toFixed(1) || 0}</span>
                </div>
              </div>
            </div>

            <div className="content-trends">
              <h3>Content Creation Trends</h3>
              <div className="trend-chart">
                {recipeAnalytics.slice(-14).map((data, index) => (
                  <div key={index} className="trend-day">
                    <div className="trend-bars">
                      <div 
                        className="created-bar" 
                        style={{ height: `${(data.recipesCreated / 20) * 100}%` }}
                        title={`${data.recipesCreated} created`}
                      ></div>
                      <div 
                        className="approved-bar" 
                        style={{ height: `${(data.recipesApproved / 20) * 100}%` }}
                        title={`${data.recipesApproved} approved`}
                      ></div>
                    </div>
                    <div className="trend-label">
                      {new Date(data.date).getMonth() + 1}/{new Date(data.date).getDate()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="trend-legend">
                <div className="legend-item">
                  <div className="legend-color created"></div>
                  <span>Created</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color approved"></div>
                  <span>Approved</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === 'moderation' && (
          <div className="moderation-tab">
            <div className="tab-header">
              <h2>Content Moderation</h2>
              <div className="moderation-stats">
                <span className="pending-count">
                  {pendingModeration.length} items pending review
                </span>
              </div>
            </div>

            <div className="moderation-list">
              {pendingModeration.length === 0 ? (
                <div className="no-pending">
                  <div className="no-pending-icon">✅</div>
                  <h3>All caught up!</h3>
                  <p>No content pending moderation at the moment.</p>
                </div>
              ) : (
                pendingModeration.map((item) => (
                  <div key={item.id} className="moderation-item">
                    <div className="moderation-header">
                      <div className="content-type-badge">
                        {item.type === 'recipe' ? '📝' : item.type === 'comment' ? '💬' : '📚'}
                        {item.type}
                      </div>
                      <div className="content-title">{item.title}</div>
                      <div className="content-author">by {item.createdBy}</div>
                      <div className="content-date">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="content-preview">
                      <p>{item.content.substring(0, 200)}...</p>
                      {item.status === 'FLAGGED' && (
                        <div className="flag-reason">
                          🚩 Flagged: {item.flagReason} ({item.reportCount} reports)
                        </div>
                      )}
                    </div>

                    <div className="moderation-actions">
                      <button
                        className="action-btn approve"
                        onClick={() => handleModeration(item.id, 'approve')}
                        disabled={actionLoading}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="action-btn deny"
                        onClick={() => handleModeration(item.id, 'deny', 'Content violates guidelines')}
                        disabled={actionLoading}
                      >
                        ❌ Deny
                      </button>
                      <button
                        className="action-btn flag"
                        onClick={() => handleModeration(item.id, 'flag', 'Needs further review')}
                        disabled={actionLoading}
                      >
                        🚩 Flag
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="system-tab">
            <div className="tab-header">
              <h2>System Health</h2>
            </div>

            {systemHealth && (
              <div className="system-health">
                <div className="health-overview">
                  <div className="health-item">
                    <div className="health-label">Server Status</div>
                    <div 
                      className="health-status"
                      style={{ color: getHealthColor(systemHealth.serverStatus) }}
                    >
                      {systemHealth.serverStatus}
                    </div>
                  </div>
                  <div className="health-item">
                    <div className="health-label">Database Status</div>
                    <div 
                      className="health-status"
                      style={{ color: getHealthColor(systemHealth.databaseStatus) }}
                    >
                      {systemHealth.databaseStatus}
                    </div>
                  </div>
                  <div className="health-item">
                    <div className="health-label">API Response Time</div>
                    <div className="health-value">{systemHealth.apiResponseTime}ms</div>
                  </div>
                  <div className="health-item">
                    <div className="health-label">Error Rate</div>
                    <div className="health-value">{systemHealth.errorRate.toFixed(2)}%</div>
                  </div>
                </div>

                <div className="resource-usage">
                  <div className="usage-item">
                    <div className="usage-label">Memory Usage</div>
                    <div className="usage-bar">
                      <div 
                        className="usage-fill" 
                        style={{ width: `${systemHealth.memoryUsage}%` }}
                      ></div>
                    </div>
                    <div className="usage-value">{systemHealth.memoryUsage}%</div>
                  </div>

                  <div className="usage-item">
                    <div className="usage-label">CPU Usage</div>
                    <div className="usage-bar">
                      <div 
                        className="usage-fill" 
                        style={{ width: `${systemHealth.cpuUsage}%` }}
                      ></div>
                    </div>
                    <div className="usage-value">{systemHealth.cpuUsage}%</div>
                  </div>

                  <div className="usage-item">
                    <div className="usage-label">Disk Usage</div>
                    <div className="usage-bar">
                      <div 
                        className="usage-fill" 
                        style={{ width: `${systemHealth.diskUsage}%` }}
                      ></div>
                    </div>
                    <div className="usage-value">{systemHealth.diskUsage}%</div>
                  </div>
                </div>

                <div className="system-info">
                  <div className="info-item">
                    <span className="info-label">Active Connections:</span>
                    <span className="info-value">{systemHealth.activeConnections}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Uptime:</span>
                    <span className="info-value">
                      {Math.floor(systemHealth.uptime / 86400)} days
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Backup:</span>
                    <span className="info-value">
                      {new Date(systemHealth.lastBackup).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;