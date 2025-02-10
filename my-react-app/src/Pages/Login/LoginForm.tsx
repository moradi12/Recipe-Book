// src/Components/Login/LoginForm.tsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // <-- for navigation
import { loginUser } from "../../Utiles/authService";
import { notify } from "../../Utiles/notif";
import { authState, loginAction } from "../Redux/AuthReducer";
import { AppDispatch } from "../Redux/store";
import "./LoginForm.css"; // Ensure this CSS file now contains the new class names

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
      dispatch(loginAction(userState));
      sessionStorage.setItem("jwt", response.token);

      notify.success("Login Successful!");
      navigate("/");
    } catch (err: unknown) {
      notify.error("Login Failed please check your credentials");
      console.error(err);
    }
  }

  return (
    <div className="loginForm-container">
      <h2 className="loginForm-title">Login</h2>

      <form onSubmit={handleLogin}>
        <div className="loginForm-group">
          <label htmlFor="usernameOrEmail">Username or Email</label>
          <input
            id="usernameOrEmail"
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            className="loginForm-input"
            placeholder="Enter username or email"
          />
        </div>

        <div className="loginForm-group">
          <label htmlFor="loginPassword">Password</label>
          <input
            id="loginPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="loginForm-input"
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="loginForm-submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
