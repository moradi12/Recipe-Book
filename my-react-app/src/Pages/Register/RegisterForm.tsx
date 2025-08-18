import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { registerUser, checkUsernameAvailability, checkEmailAvailability } from "../../Utiles/authService";
import { notify } from "../../Utiles/notif";
import { authState, loginAction } from "../Redux/AuthReducer";
import { AppDispatch } from "../Redux/store";

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation and availability state
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [availabilityStatus, setAvailabilityStatus] = useState({
    username: { checking: false, available: null as boolean | null },
    email: { checking: false, available: null as boolean | null }
  });

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, text: "", color: "", width: 0 };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthLevels = [
      { text: "Very Weak", color: "#FF4757", width: 20 },
      { text: "Weak", color: "#FF6B35", width: 40 },
      { text: "Fair", color: "#FFA726", width: 60 },
      { text: "Good", color: "#66BB6A", width: 80 },
      { text: "Strong", color: "#2ECC71", width: 100 }
    ];

    return { score, ...strengthLevels[Math.min(score, 4)] };
  };

  // Debounce utility
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Username availability check
  const checkUsernameAvailabilityDebounced = useCallback(
    debounce(async (username: string) => {
      if (username.length < 3) return;
      
      setAvailabilityStatus(prev => ({
        ...prev,
        username: { checking: true, available: null }
      }));

      try {
        const result = await checkUsernameAvailability(username);
        setAvailabilityStatus(prev => ({
          ...prev,
          username: { checking: false, available: result.available }
        }));
      } catch (error) {
        setAvailabilityStatus(prev => ({
          ...prev,
          username: { checking: false, available: null }
        }));
      }
    }, 600),
    []
  );

  // Email availability check
  const checkEmailAvailabilityDebounced = useCallback(
    debounce(async (email: string) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
      
      setAvailabilityStatus(prev => ({
        ...prev,
        email: { checking: true, available: null }
      }));

      try {
        const result = await checkEmailAvailability(email);
        setAvailabilityStatus(prev => ({
          ...prev,
          email: { checking: false, available: result.available }
        }));
      } catch (error) {
        setAvailabilityStatus(prev => ({
          ...prev,
          email: { checking: false, available: null }
        }));
      }
    }, 600),
    []
  );

  // Field validation
  const validateField = (field: string, value: string) => {
    let error = "";
    
    switch (field) {
      case "username":
        if (!value.trim()) error = "Username is required";
        else if (value.length < 3) error = "Username must be at least 3 characters";
        else if (!/^[a-zA-Z0-9_]+$/.test(value)) error = "Username can only contain letters, numbers, and underscores";
        else if (availabilityStatus.username.available === false) error = "Username is already taken";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email address";
        else if (availabilityStatus.email.available === false) error = "Email is already registered";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        if (!value) error = "Please confirm your password";
        else if (value !== formData.password) error = "Passwords do not match";
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === "";
  };

  // Handle input changes
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate immediately
    validateField(field, value);
    
    // Check availability for username and email
    if (field === "username" && value.length >= 3) {
      checkUsernameAvailabilityDebounced(value);
    } else if (field === "username") {
      setAvailabilityStatus(prev => ({
        ...prev,
        username: { checking: false, available: null }
      }));
    }
    
    if (field === "email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      checkEmailAvailabilityDebounced(value);
    } else if (field === "email") {
      setAvailabilityStatus(prev => ({
        ...prev,
        email: { checking: false, available: null }
      }));
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isUsernameValid = validateField("username", formData.username);
    const isEmailValid = validateField("email", formData.email);
    const isPasswordValid = validateField("password", formData.password);
    const isConfirmPasswordValid = validateField("confirmPassword", formData.confirmPassword);

    // Check availability
    const isUsernameAvailable = availabilityStatus.username.available === true;
    const isEmailAvailable = availabilityStatus.email.available === true;

    if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      notify.error("Please fix all validation errors");
      return;
    }

    if (!isUsernameAvailable) {
      notify.error("Please choose an available username");
      return;
    }

    if (!isEmailAvailable) {
      notify.error("Please use an available email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

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
      notify.success("Welcome to Recipe Book! 🎉");
    } catch (err: unknown) {
      notify.error("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'var(--font-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Shapes */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        filter: 'blur(1px)'
      }} />
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse',
        filter: 'blur(1px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: '100px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0.06)',
        borderRadius: '50%',
        animation: 'float 10s ease-in-out infinite',
        filter: 'blur(1px)'
      }} />

      {/* Main Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        maxWidth: '900px',
        width: '100%',
        minHeight: '600px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative'
      }}>
        {/* Left Side - Branding */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 40px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(3px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            filter: 'blur(2px)'
          }} />

          <div style={{
            zIndex: 1,
            textAlign: 'center'
          }}>
            {/* Logo */}
            <div style={{
              width: '120px',
              height: '120px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 30px',
              fontSize: '48px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              animation: 'pulse 2s infinite'
            }}>
              🍳
            </div>

            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '20px',
              fontFamily: 'var(--font-heading)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}>
              Recipe Book
            </h1>

            <p style={{
              fontSize: '1.2rem',
              opacity: 0.9,
              lineHeight: '1.6',
              marginBottom: '30px'
            }}>
              Join thousands of food lovers sharing their favorite recipes
            </p>

            {/* Feature List */}
            <div style={{ textAlign: 'left', maxWidth: '280px' }}>
              {[
                "🌟 Share your recipes",
                "📱 Mobile-friendly design", 
                "💝 Save favorites",
                "🔍 Discover new dishes"
              ].map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px',
                  fontSize: '1rem',
                  opacity: 0.9
                }}>
                  <span style={{ marginRight: '12px', fontSize: '1.2rem' }}>
                    {feature.split(' ')[0]}
                  </span>
                  <span>{feature.substring(feature.indexOf(' ') + 1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '360px', margin: '0 auto', width: '100%' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#2D3748',
                marginBottom: '8px',
                fontFamily: 'var(--font-heading)'
              }}>
                Create Account
              </h2>
              <p style={{
                color: '#718096',
                fontSize: '1rem'
              }}>
                Start your culinary journey today
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Username Field */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4A5568',
                  marginBottom: '8px'
                }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange("username")}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      paddingRight: '50px',
                      border: `2px solid ${errors.username ? '#E53E3E' : '#E2E8F0'}`,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#FAFAFA',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      if (!errors.username) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = '#FFFFFF';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.username) {
                        e.target.style.borderColor = '#E2E8F0';
                        e.target.style.background = '#FAFAFA';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                    placeholder="Choose a unique username"
                    required
                  />
                  
                  {/* Status Indicator */}
                  <div style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>
                    {availabilityStatus.username.checking && (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #E2E8F0',
                        borderTop: '2px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    )}
                    {!availabilityStatus.username.checking && availabilityStatus.username.available === true && (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: '#38A169',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>✓</div>
                    )}
                    {!availabilityStatus.username.checking && availabilityStatus.username.available === false && (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: '#E53E3E',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>✗</div>
                    )}
                  </div>
                </div>
                
                {/* Status Message */}
                {errors.username ? (
                  <p style={{ color: '#E53E3E', fontSize: '0.875rem', margin: '6px 0 0', fontWeight: '500' }}>
                    {errors.username}
                  </p>
                ) : availabilityStatus.username.available === true ? (
                  <p style={{ color: '#38A169', fontSize: '0.875rem', margin: '6px 0 0', fontWeight: '500' }}>
                    ✓ Username is available
                  </p>
                ) : availabilityStatus.username.available === false ? (
                  <p style={{ color: '#E53E3E', fontSize: '0.875rem', margin: '6px 0 0', fontWeight: '500' }}>
                    ✗ Username is already taken
                  </p>
                ) : (
                  <p style={{ color: '#A0AEC0', fontSize: '0.875rem', margin: '6px 0 0' }}>
                    Letters, numbers, and underscores only
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4A5568',
                  marginBottom: '8px'
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      paddingRight: '50px',
                      border: `2px solid ${errors.email ? '#E53E3E' : '#E2E8F0'}`,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#FAFAFA',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      if (!errors.email) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = '#FFFFFF';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.email) {
                        e.target.style.borderColor = '#E2E8F0';
                        e.target.style.background = '#FAFAFA';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                    placeholder="Enter your email address"
                    required
                  />
                  
                  {/* Status Indicator */}
                  <div style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>
                    {availabilityStatus.email.checking && (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid #E2E8F0',
                        borderTop: '2px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    )}
                    {!availabilityStatus.email.checking && availabilityStatus.email.available === true && (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: '#38A169',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>✓</div>
                    )}
                    {!availabilityStatus.email.checking && availabilityStatus.email.available === false && (
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: '#E53E3E',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>✗</div>
                    )}
                  </div>
                </div>
                
                {/* Status Message */}
                {errors.email ? (
                  <p style={{ color: '#E53E3E', fontSize: '0.875rem', margin: '6px 0 0', fontWeight: '500' }}>
                    {errors.email}
                  </p>
                ) : availabilityStatus.email.available === true ? (
                  <p style={{ color: '#38A169', fontSize: '0.875rem', margin: '6px 0 0', fontWeight: '500' }}>
                    ✓ Email is available
                  </p>
                ) : availabilityStatus.email.available === false ? (
                  <p style={{ color: '#E53E3E', fontSize: '0.875rem', margin: '6px 0 0', fontWeight: '500' }}>
                    ✗ Email is already registered
                  </p>
                ) : (
                  <p style={{ color: '#A0AEC0', fontSize: '0.875rem', margin: '6px 0 0' }}>
                    We'll never share your email
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4A5568',
                  marginBottom: '8px'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      paddingRight: '50px',
                      border: `2px solid ${errors.password ? '#E53E3E' : '#E2E8F0'}`,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#FAFAFA',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      if (!errors.password) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = '#FFFFFF';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.password) {
                        e.target.style.borderColor = '#E2E8F0';
                        e.target.style.background = '#FAFAFA';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                    placeholder="Create a strong password"
                    required
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#A0AEC0',
                      padding: '2px'
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                
                {/* Password Strength */}
                {formData.password && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      marginBottom: '6px'
                    }}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '2px',
                            background: passwordStrength.score >= level 
                              ? passwordStrength.color 
                              : '#E2E8F0',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      ))}
                    </div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: passwordStrength.color,
                      fontWeight: '500',
                      margin: 0
                    }}>
                      {passwordStrength.text}
                    </p>
                  </div>
                )}
                
                {errors.password && (
                  <p style={{ color: '#E53E3E', fontSize: '0.875rem', margin: '6px 0 0', fontWeight: '500' }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4A5568',
                  marginBottom: '8px'
                }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      paddingRight: '50px',
                      border: `2px solid ${errors.confirmPassword ? '#E53E3E' : '#E2E8F0'}`,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      background: '#FAFAFA',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      if (!errors.confirmPassword) {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.background = '#FFFFFF';
                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.confirmPassword) {
                        e.target.style.borderColor = '#E2E8F0';
                        e.target.style.background = '#FAFAFA';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                    placeholder="Confirm your password"
                    required
                  />
                  
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#A0AEC0',
                      padding: '2px'
                    }}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                
                {errors.confirmPassword && (
                  <p style={{ color: '#E53E3E', fontSize: '0.875rem', margin: '6px 0 0', fontWeight: '500' }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: isLoading 
                    ? '#A0AEC0' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                  boxShadow: isLoading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                  transform: isLoading ? 'none' : 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span style={{ fontSize: '1.2rem' }}>→</span>
                  </>
                )}
              </button>

              {/* Sign In Link */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#718096', margin: 0 }}>
                  Already have an account?{' '}
                  <a
                    href="/login"
                    style={{
                      color: '#667eea',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#764ba2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#667eea';
                    }}
                  >
                    Sign in here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @media (max-width: 768px) {
            .main-container {
              grid-template-columns: 1fr !important;
              max-width: 400px !important;
            }
            .branding-side {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default RegisterForm;