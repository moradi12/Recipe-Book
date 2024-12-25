// src/components/Login.tsx

import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Utiles/authService';
import { notify } from '../../Utiles/notif';
import { authState, loginAction } from '../Redux/AuthReducer';
import { recipeSystem } from '../Redux/store';
import './Login.css';

type jwtData = {
  userType: string;
  userName: string;
  id: number;
  sub: string;
  iat: number;
  exp: number;
};

const Login: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', usernameOrEmail, 'and provided password.');
      const token = await login(usernameOrEmail, password);

      console.log('Login successful!');
      console.log('Received JWT Token:', token);

      // Store the token in sessionStorage for consistency
      sessionStorage.setItem('jwt', token);

      // Decode the JWT to extract user information
      const decoded_jwt = jwtDecode<jwtData>(token);
      console.log('Decoded JWT:', decoded_jwt);

      // Create an authState object
      const myAuth: authState = {
        id: decoded_jwt.id,
        email: decoded_jwt.sub,
        name: decoded_jwt.userName,
        token: token,
        userType: decoded_jwt.userType,
        isLogged: true,
      };

      // Dispatch the login action to update the Redux store
      recipeSystem.dispatch(loginAction(myAuth));

      // Notify the user of successful login
      notify.success(`Login successful! Welcome, ${usernameOrEmail}`);

      // Navigate to the home page
      navigate('/');

      // No need to reload the page as Redux state is updated
    } catch (err: unknown) {
      console.error('Login failed:', err);
      if (err instanceof Error && err.message === 'Invalid credentials') {
        setError('Incorrect email or password. Please try again.');
        notify.error('Login failed: Incorrect email or password.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
        notify.error('An unexpected error occurred.');
      }
    } finally {
      console.log('Login process complete. Resetting loading state.');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="usernameOrEmail">Username or Email:</label>
        <input
          id="usernameOrEmail"
          type="text"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
