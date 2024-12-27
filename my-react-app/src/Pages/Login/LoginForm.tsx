// src/Components/Login/LoginForm.tsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // <-- for navigation
import { loginUser } from "../../Utiles/AuthService";
import { notify } from "../../Utiles/notif";
import { authState, loginAction } from "../Redux/AuthReducer";
import { AppDispatch } from "../Redux/store";
import "./LoginForm.css"; // (Optional dark style)

const LoginForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      // 1) Perform the backend call
      const response = await loginUser({ usernameOrEmail, password });

      // 2) Build userState from response
      const userState: authState = {
        email: response.email,
        name: response.username,
        id: response.id,
        token: response.token,
        userType: response.userType,
        isLogged: true,
      };

      // 3) Dispatch to Redux
      dispatch(loginAction(userState));

      // 4) Save token to sessionStorage for refresh persistence
      sessionStorage.setItem("jwt", response.token);

      // 5) Notify success
      notify.success("Login Successful!");

      // 6) Navigate to root (http://localhost:5173/)
      navigate("/");
    } catch (err: unknown) {
      notify.error("Login Failed");
      console.error(err);
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="usernameOrEmail">Username or Email</label>
          <input
            id="usernameOrEmail"
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            className="input-field"
            placeholder="Enter username or email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="loginPassword">Password</label>
          <input
            id="loginPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
