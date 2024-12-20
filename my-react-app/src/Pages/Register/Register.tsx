import React, { useState } from "react";
import { register } from "../../Utiles/authService";
import "./Register.css";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation logic
  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username.trim() || formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long.";
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format.";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    console.log("Validation Errors:", newErrors); // Log validation errors
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log(`Input Changed: ${id} = ${value}`); // Log input changes
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData); // Log form submission
    setErrorMessage("");
    setSuccessMessage("");

    if (!validate()) {
      console.log("Validation Failed"); // Log validation failure
      return;
    }

    setLoading(true);
    console.log("Sending Request to Register API..."); // Log API request initiation
    try {
      await register(formData.username, formData.email, formData.password);
      console.log("Registration Successful"); // Log success
      setSuccessMessage(`Welcome, ${formData.username}! Registration successful.`);
      setFormData({ username: "", email: "", password: "", confirmPassword: "" }); // Reset form
    } catch (error) {
      console.error("Registration Error:", error); // Log error
      if (error instanceof Error) {
        setErrorMessage(error.message || "Registration failed.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      console.log("Request Completed"); // Log request completion
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? "input-error" : ""}
            placeholder="Enter your username"
          />
          {errors.username && <small className="error">{errors.username}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
            placeholder="Enter your email"
          />
          {errors.email && <small className="error">{errors.email}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
            placeholder="Enter your password"
          />
          {errors.password && <small className="error">{errors.password}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "input-error" : ""}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <small className="error">{errors.confirmPassword}</small>}
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
