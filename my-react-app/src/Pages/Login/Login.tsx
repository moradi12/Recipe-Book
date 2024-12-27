import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../Utiles/AuthService"; // <-- your existing service
import { notify } from "../../Utiles/notif"; // <-- your notify utility
import { authState, loginAction } from "../Redux/AuthReducer";
import { AppDispatch } from "../Redux/store";
import "./LoginForm.css"; // Import the CSS file

const LoginForm: React.FC = () => {
  // Use typed dispatch from our Redux store
  const dispatch = useDispatch<AppDispatch>();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      // 1) Call the backend via AuthService
      const response = await loginUser({ usernameOrEmail, password });

      // 2) Build an authState object
      const userState: authState = {
        email: response.email,
        name: response.username,
        id: response.id,
        token: response.token,
        userType: response.userType,
        isLogged: true,
      };

      // 3) Dispatch loginAction to update Redux
      dispatch(loginAction(userState));

      // 4) Save the JWT in sessionStorage (optional, if you want persistence)
      sessionStorage.setItem("jwt", response.token);

      // 5) Notify success
      notify.success("Login Successful!");
    } catch (err: unknown) {
      // Display error notification
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
