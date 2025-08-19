import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../Pages/Redux/slices/unifiedAuthSlice";
import { AppDispatch, RootState } from "../../Pages/Redux/store";
// Using inline styles for minimal, professional design

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLogged = useSelector((state: RootState) => state.auth.isLogged);

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  /* Toggle the mobile menu */
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  /* Logout handler */
  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("jwt");
    navigate("/login");
    setIsOpen(false);
  };

  /* Close menu when clicking outside or on escape */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.querySelector('.navbar-container');
      if (navbar && !navbar.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav style={{
      backgroundColor: 'var(--background-primary)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="navbar-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--spacing-lg)',
        height: '64px'
      }}>
        {/* Logo */}
        <div style={{ flexShrink: 0 }}>
          <NavLink 
            to="/" 
            onClick={() => setIsOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 'var(--font-weight-bold)',
              transition: 'color var(--transition-normal)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          >
            <div style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-light)'
            }}>
              <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span>Recipe Hub</span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)'
        }}
        className="desktop-nav"
        >
          <NavLink 
            to="/"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 'var(--font-weight-medium)',
              transition: 'all var(--transition-normal)',
              backgroundColor: isActive ? 'var(--background-tertiary)' : 'transparent'
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Home
          </NavLink>

          <NavLink 
            to="/all/recipes"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 'var(--font-weight-medium)',
              transition: 'all var(--transition-normal)',
              backgroundColor: isActive ? 'var(--background-tertiary)' : 'transparent'
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Recipes
          </NavLink>

          <NavLink 
            to="/create"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 'var(--font-weight-medium)',
              transition: 'all var(--transition-normal)',
              backgroundColor: isActive ? 'var(--background-tertiary)' : 'transparent'
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Create
          </NavLink>

          {isLogged && (
            <NavLink 
              to="/userpanel"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 'var(--font-weight-medium)',
                transition: 'all var(--transition-normal)',
                backgroundColor: isActive ? 'var(--background-tertiary)' : 'transparent'
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('active')) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Profile
            </NavLink>
          )}
        </div>

        {/* Auth Section */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          flexShrink: 0
        }}
        className="auth-section"
        >
          {!isLogged ? (
            <>
              <NavLink 
                to="/login" 
                onClick={() => setIsOpen(false)}
                style={{
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 'var(--font-weight-medium)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-normal)',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Sign In
              </NavLink>
              <NavLink 
                to="/register" 
                onClick={() => setIsOpen(false)}
                style={{
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--text-light)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 'var(--font-weight-medium)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-normal)',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Sign Up
              </NavLink>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--background-tertiary)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)'
              }}>
                <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-xs) var(--spacing-md)',
                  background: 'transparent',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  fontSize: '0.875rem',
                  fontWeight: 'var(--font-weight-medium)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--text-primary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--spacing-xs)',
            borderRadius: 'var(--radius-md)',
            transition: 'all var(--transition-normal)'
          }}
          className="mobile-menu-btn"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div style={{
            width: '20px',
            height: '2px',
            backgroundColor: 'var(--text-primary)',
            transition: 'all var(--transition-normal)',
            transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
          }}></div>
          <div style={{
            width: '20px',
            height: '2px',
            backgroundColor: 'var(--text-primary)',
            margin: '3px 0',
            transition: 'all var(--transition-normal)',
            opacity: isOpen ? 0 : 1
          }}></div>
          <div style={{
            width: '20px',
            height: '2px',
            backgroundColor: 'var(--text-primary)',
            transition: 'all var(--transition-normal)',
            transform: isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
          }}></div>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div style={{
          display: 'none',
          position: 'fixed',
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'var(--background-primary)',
          borderTop: '1px solid var(--border-light)',
          zIndex: 999,
          overflowY: 'auto'
        }}
        className="mobile-nav"
        >
          <div style={{ padding: 'var(--spacing-lg)' }}>
            {/* Mobile Navigation Links */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <NavLink 
                to="/"
                onClick={() => setIsOpen(false)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-normal)',
                  marginBottom: 'var(--spacing-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span>Home</span>
              </NavLink>

              <NavLink 
                to="/all/recipes"
                onClick={() => setIsOpen(false)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-normal)',
                  marginBottom: 'var(--spacing-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 9h5V4H4v5zm0 11h5v-5H4v5zm6 0h5v-5h-5v5zm6-10v5h5V9h-5z"/>
                </svg>
                <span>Recipes</span>
              </NavLink>

              <NavLink 
                to="/create"
                onClick={() => setIsOpen(false)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-normal)',
                  marginBottom: 'var(--spacing-sm)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <span>Create</span>
              </NavLink>

              {isLogged && (
                <NavLink 
                  to="/userpanel"
                  onClick={() => setIsOpen(false)}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all var(--transition-normal)',
                    marginBottom: 'var(--spacing-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span>Profile</span>
                </NavLink>
              )}
            </div>
            
            {/* Mobile Auth */}
            <div style={{ 
              borderTop: '1px solid var(--border-light)',
              paddingTop: 'var(--spacing-lg)'
            }}>
              {!isLogged ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <NavLink 
                    to="/login" 
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 'var(--spacing-md)',
                      backgroundColor: 'transparent',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: 'var(--font-weight-medium)',
                      transition: 'all var(--transition-normal)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--text-primary)';
                      e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Sign In
                  </NavLink>
                  <NavLink 
                    to="/register" 
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 'var(--spacing-md)',
                      backgroundColor: 'var(--text-primary)',
                      color: 'var(--text-light)',
                      textDecoration: 'none',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: 'var(--font-weight-medium)',
                      transition: 'all var(--transition-normal)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--text-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--text-primary)';
                    }}
                  >
                    Sign Up
                  </NavLink>
                </div>
              ) : (
                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-primary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
