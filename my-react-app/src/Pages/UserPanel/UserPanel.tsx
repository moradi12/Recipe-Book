import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeResponse } from '../../Models/RecipeResponse'; // NEW CODE
import RecipeService from '../../Service/RecipeService'; // NEW CODE
import UserService from '../../Service/UserService';
import { checkData } from '../../Utiles/checkData';
import { notify } from '../../Utiles/notif';
import recipeSystem from '../Redux/store';
import './UserPanel.css';

// Define the structure of the decoded JWT
type DecodedJwt = {
  id: number;
  userName: string;
  userType: string;
  exp: number; // Expiry time in seconds since epoch
};

const UserPanel: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Store the user info from the token
  const [userInfo, setUserInfo] = useState<DecodedJwt | null>(null);

  // NEW CODE: store recipes created by the current user
  const [myRecipes, setMyRecipes] = useState<RecipeResponse[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Verify user is logged in and token is valid
    checkData();
    const state = recipeSystem.getState();
    const token = state.auth.token;

    if (!token) {
      notify.error('You must be logged in to access the user panel.');
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode<DecodedJwt>(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        notify.error('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      // If valid token, store user info
      setUserInfo(decoded);

      // NEW CODE: fetch user’s own recipes
      RecipeService.getMyRecipes(token)
        .then((res) => {
          setMyRecipes(res.data);
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
      const response = await UserService.updatePassword(token, newPassword);
      notify.success(response.message);

      // Clear input fields
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      notify.error('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-panel">
      {userInfo ? (
        <>
          <h2>User Panel</h2>

          {/* Show basic user info */}
          <div className="user-info">
            <p><strong>Username:</strong> {userInfo.userName}</p>
            <p><strong>User Type:</strong> {userInfo.userType}</p>
          </div>

          {/* Password Update Form */}
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

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          {/* NEW CODE: Render the user's recipes */}
          <hr />
          <h3>My Recipes</h3>
          {myRecipes.length === 0 ? (
            <p>You haven't created any recipes yet.</p>
          ) : (
            <ul>
              {myRecipes.map((recipe) => (
                <li key={recipe.id}>
                  <strong>{recipe.title}</strong> - {recipe.description}
                </li>
              ))}
            </ul>
          )}

        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserPanel;
