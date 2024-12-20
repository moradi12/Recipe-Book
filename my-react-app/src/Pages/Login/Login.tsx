import React, { useState } from 'react';
import { login } from '../../Utiles/authService';
import { notify } from '../../Utiles/notif'; // Assuming you use a notification library
import './Login.css';

const Login: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', usernameOrEmail, 'and provided password.');
      const token = await login(usernameOrEmail, password);

      console.log('Login successful!');
      console.log('Received JWT Token:', token);

      notify.success(`Login successful! Welcome, ${usernameOrEmail}`);

      // Perform additional logic if needed, such as saving the token
      console.log('Storing token or initiating user session...');

      window.location.reload();
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
