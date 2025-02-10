import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../Utiles/authService";
import { notify } from "../../Utiles/notif";
import { authState, loginAction } from "../Redux/AuthReducer";
import { AppDispatch } from "../Redux/store";
import "./RegisterForm.css"; // This now contains the new class names

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      notify.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      notify.error("Passwords do not match.");
      return;
    }

    try {
      const response = await registerUser({ username, email, password });

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
      notify.success("Registration Successful!");
    } catch (err: unknown) {
      notify.error("Registration Failed");
      console.error(err);
    }
  }

  return (
    <div className="registerForm-container">
      <h2 className="registerForm-title">Register</h2>
      <form onSubmit={handleRegister}>
        <div className="registerForm-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="registerForm-input"
          />
        </div>

        <div className="registerForm-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="registerForm-input"
          />
        </div>

        <div className="registerForm-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="registerForm-input"
          />
        </div>

        <div className="registerForm-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="registerForm-input"
          />
        </div>

        <button type="submit" className="registerForm-submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
