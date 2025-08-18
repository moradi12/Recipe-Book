import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeResponse } from '../../Models/RecipeResponse';
import RecipeService from '../../Service/RecipeService';
import UserService from '../../Service/UserService';
import { checkData } from '../../Utiles/checkData';
import { notify } from '../../Utiles/notif';
import { useFavorites } from '../../hooks/useFavorites';
import recipeSystem from '../Redux/store';
import './UserPanel.css';

// Import the custom hook

type DecodedJwt = {
  id: number;
  userName: string;
  userType: string;
  exp: number; 
};

const UserPanel: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // The user info from the token
  const [userInfo, setUserInfo] = useState<DecodedJwt | null>(null);

  // The user's own recipes
  const [myRecipes, setMyRecipes] = useState<RecipeResponse[]>([]);

  // User statistics
  const [userStats, setUserStats] = useState({
    totalRecipes: 0,
    favoriteRecipes: 0,
    recipesThisMonth: 0
  });

  // Use the favorites hook
  const { favoriteRecipeIds, toggleFavorite, loading: favoritesLoading } = useFavorites();

  const navigate = useNavigate();

  useEffect(() => {
    checkData();
    const token = recipeSystem.getState().auth.token;

    if (!token) {
      notify.error('You must be logged in to access the user panel.');
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode<DecodedJwt>(token);
      if (decoded.exp * 1000 < Date.now()) {
        notify.error('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      setUserInfo(decoded);

      // Fetch the user's own recipes
      RecipeService.getMyRecipes()
        .then((res) => {
          setMyRecipes(res.data);
          
          // Calculate user statistics
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const recipesThisMonth = res.data.filter((recipe: RecipeResponse) => {
            if (recipe.createdAt) {
              const recipeDate = new Date(recipe.createdAt);
              return recipeDate.getMonth() === currentMonth && recipeDate.getFullYear() === currentYear;
            }
            return false;
          }).length;

          setUserStats({
            totalRecipes: res.data.length,
            favoriteRecipes: favoriteRecipeIds.length,
            recipesThisMonth
          });
        })
        .catch((err) => {
          console.error('Error fetching my recipes:', err);
        });
    } catch (error) {
      console.error('Error decoding JWT:', error);
      notify.error('Invalid token. Please log in again.');
      navigate('/login');
    }
  }, [navigate]);

  // Update favorites count when favoriteRecipeIds changes
  useEffect(() => {
    setUserStats(prev => ({
      ...prev,
      favoriteRecipes: favoriteRecipeIds.length
    }));
  }, [favoriteRecipeIds.length]);

  // Handle Password Update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      notify.error('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      notify.error('Passwords do not match.');
      return;
    }

    const token = recipeSystem.getState().auth.token;
    if (!token) {
      notify.error('User is not authenticated. Please log in.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await UserService.updatePassword(newPassword);
      notify.success(response.data.message);

      // Clear input fields
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error updating password:', error);
      notify.error('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    const token = recipeSystem.getState().auth.token;
    if (!token) {
      notify.error('User is not authenticated.');
      return;
    }

    try {
      await RecipeService.deleteRecipe(recipeId);
      notify.success('Recipe deleted successfully');
      
      // Refresh recipes list
      const res = await RecipeService.getMyRecipes();
      setMyRecipes(res.data);
      
      // Update statistics
      setUserStats(prev => ({
        ...prev,
        totalRecipes: res.data.length
      }));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      notify.error('Failed to delete recipe');
    }
  };

  return (
    <div className="user-panel">
      {userInfo ? (
        <>
          {/* Header Section */}
          <div className="user-panel-header">
            <div className="user-avatar">
              <div className="avatar-circle">
                {userInfo.userName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="user-info">
              <h2>Welcome, {userInfo.userName}!</h2>
              <div className="user-badge">
                <span className={`badge ${userInfo.userType.toLowerCase()}`}>
                  {userInfo.userType}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-section">
            <h3>Your Statistics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{userStats.totalRecipes}</div>
                <div className="stat-label">Total Recipes</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{userStats.favoriteRecipes}</div>
                <div className="stat-label">Favorite Recipes</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{userStats.recipesThisMonth}</div>
                <div className="stat-label">This Month</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button 
                className="action-btn primary" 
                onClick={() => navigate('/create')}
              >
                Create New Recipe
              </button>
              
              <button 
                className="action-btn secondary" 
                onClick={() => navigate('/my-favorites')}
              >
                View Favorites
              </button>
              
              <button 
                className="action-btn secondary" 
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                Change Password
              </button>
              
              {userInfo.userType === 'ADMIN' && (
                <button 
                  className="action-btn admin" 
                  onClick={() => navigate('/admin')}
                >
                  Admin Dashboard
                </button>
              )}
            </div>
          </div>

          {/* Password Update Form */}
          {showPasswordForm && (
            <div className="password-section">
              <h3>Change Password</h3>
              <form onSubmit={handleUpdate} className="user-panel-form">
                <div className="form-group">
                  <label htmlFor="password">New Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password:</label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit" disabled={isLoading} className="btn-update">
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowPasswordForm(false)}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* My Recipes Section */}
          <div className="recipes-section">
            <h3>My Recipes ({myRecipes.length})</h3>
            {myRecipes.length === 0 ? (
              <div className="empty-state">
                <p>You haven't created any recipes yet.</p>
                <button 
                  className="action-btn primary" 
                  onClick={() => navigate('/create')}
                >
                  Create Your First Recipe
                </button>
              </div>
            ) : (
              <div className="recipes-grid">
                {myRecipes.map((recipe) => {
                  const isFav = favoriteRecipeIds.includes(recipe.id);

                  return (
                    <div key={recipe.id} className="recipe-card">
                      <div className="recipe-header">
                        <h4>{recipe.title}</h4>
                        <div className="recipe-actions">
                          <button 
                            className={`favorite-btn ${isFav ? 'favorited' : ''}`}
                            onClick={() => toggleFavorite(recipe.id)}
                            disabled={favoritesLoading}
                            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {favoritesLoading ? '⏳' : (isFav ? '❤️' : '🤍')}
                          </button>
                        </div>
                      </div>
                      
                      <p className="recipe-description">{recipe.description}</p>
                      
                      <div className="recipe-meta">
                        {recipe.cookingTime && (
                          <span className="meta-item">🕒 {recipe.cookingTime} min</span>
                        )}
                        {recipe.servings && (
                          <span className="meta-item">👥 {recipe.servings} servings</span>
                        )}
                      </div>
                      
                      <div className="recipe-card-actions">
                        <button 
                          className="btn-view" 
                          onClick={() => navigate(`/recipe/${recipe.id}`)}
                        >
                          View
                        </button>
                        <button 
                          className="btn-edit" 
                          onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDeleteRecipe(recipe.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      )}
    </div>
  );
};

export default UserPanel;
