import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../Utiles/authService";
import { notify } from "../../Utiles/notif";
import { AuthState, login } from "../Redux/slices/unifiedAuthSlice";
import { AppDispatch } from "../Redux/store";
import { AppError, ValidationError } from "../../errors/AppError";
import "./RegisterForm.css";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setError
  } = useForm<FormData>({
    mode: "onChange"
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    try {
      const response = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password
      });

      const userState: AuthState = {
        email: response.email,
        name: response.username,
        id: response.id,
        token: response.token,
        userType: response.userType,
        isLogged: true,
      };

      dispatch(login(userState));
      sessionStorage.setItem("jwt", response.token);
      notify.success("Welcome to Recipe Book! 🎉");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error instanceof ValidationError) {
        // Handle validation errors from the server
        if (error.hasFieldError('username')) {
          setError("username", { message: error.getFieldError('username') });
        }
        if (error.hasFieldError('email')) {
          setError("email", { message: error.getFieldError('email') });
        }
        // Don't show additional notification as field errors are shown inline
      } else if (error instanceof AppError) {
        // Handle other app errors with user-friendly messages
        notify.error(error.getUserMessage());
      } else {
        // Fallback for unexpected errors
        notify.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join the Recipe Book community</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className={`form-input ${errors.username ? 'error' : ''}`}
              placeholder="Choose a username"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Username must be at least 3 characters" },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: "Username can only contain letters, numbers, and underscores" }
              })}
            />
            {errors.username && (
              <div className="error-message">{errors.username.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" }
              })}
            />
            {errors.email && (
              <div className="error-message">{errors.email.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="password-toggle">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Create a password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                👁️
              </button>
            </div>
            {errors.password && (
              <div className="error-message">{errors.password.message}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-toggle">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: value => value === password || "Passwords do not match"
                })}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                👁️
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword.message}</div>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="login-link">
            Already have an account? <a href="/login">Sign in here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;