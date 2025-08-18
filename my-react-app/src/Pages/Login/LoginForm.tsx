import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useForm, validators } from "../../hooks";

interface LoginFormData {
  usernameOrEmail: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginLoading } = useAuth();

  // Form with validation
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = useForm<LoginFormData>(
    {
      usernameOrEmail: "",
      password: "",
    },
    {
      usernameOrEmail: validators.required("Username or email is required"),
      password: validators.required("Password is required"),
    }
  );

  // Handle form submission
  const onSubmit = async (formData: LoginFormData) => {
    const success = await login(formData);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your Recipe Book account</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="usernameOrEmail" className="form-label">
              Username or Email
            </label>
            <input
              id="usernameOrEmail"
              name="usernameOrEmail"
              type="text"
              value={values.usernameOrEmail}
              onChange={handleChange}
              className={`form-control ${errors.usernameOrEmail ? "error" : ""}`}
              placeholder="Enter your username or email"
              aria-describedby={errors.usernameOrEmail ? "usernameOrEmail-error" : undefined}
            />
            {errors.usernameOrEmail && (
              <div id="usernameOrEmail-error" className="form-error" role="alert">
                {errors.usernameOrEmail}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              className={`form-control ${errors.password ? "error" : ""}`}
              placeholder="Enter your password"
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <div id="password-error" className="form-error" role="alert">
                {errors.password}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={loginLoading}
            style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
          >
            {loginLoading ? (
              <>
                <span className="loading-spinner" style={{ marginRight: 'var(--spacing-sm)' }}></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
