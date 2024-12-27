import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../Utiles/AuthService";
import { notify } from "../../Utiles/notif";
import { authState, loginAction } from "../Redux/AuthReducer";
import { AppDispatch } from "../Redux/store"; // typed dispatch
import "./RegisterForm.css"; // optional CSS file

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    // 1. Basic front-end password length check (optional)
    if (password.length < 6) {
      notify.error("Password must be at least 6 characters long.");
      return;
    }

    // 2. Check if passwords match
    if (password !== confirmPassword) {
      notify.error("Passwords do not match.");
      return;
    }

    try {
      // 3. Make the backend request
      const response = await registerUser({ username, email, password });

      // 4. Build a new authState object
      const userState: authState = {
        email: response.email,
        name: response.username,
        id: response.id,
        token: response.token,
        userType: response.userType,
        isLogged: true,
      };

      // 5. Dispatch login action to update Redux store
      dispatch(loginAction(userState));

      // 6. Save token to sessionStorage
      sessionStorage.setItem("jwt", response.token);

      // 7. Notify success
      notify.success("Registration Successful!");
    } catch (err: unknown) {
      // Display or log error message
      notify.error("Registration Failed");
      console.error(err);
    }
  }

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>

        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
