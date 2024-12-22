// src/components/Navbar/Navbar.tsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../../Utiles/authService';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean>(isAuthenticated());
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(isAuthenticated());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <NavLink to="/" onClick={() => setIsOpen(false)}>
          Dessert Delights
        </NavLink>
      </div>

      {/* Hamburger Menu */}
      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </div>

      {/* Navigation Links */}
      <ul className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
        {/* Main Links */}
        <li>
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/food" onClick={() => setIsOpen(false)}>
            Food
          </NavLink>
        </li>
        <li>
          <NavLink to="/recipes" onClick={() => setIsOpen(false)}>
            Recipes
          </NavLink>
        </li>
        <li>
          <NavLink to="/features" onClick={() => setIsOpen(false)}>
            Features
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </NavLink>
        </li>

        {/* Authentication Links */}
        {!isAuth ? (
          <>
            <li>
              <NavLink to="/login" onClick={() => setIsOpen(false)}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" onClick={() => setIsOpen(false)}>
                Register
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}

        {/* Divider */}
        <li className={styles.divider}>|</li>

        {/* Secondary Links */}
        <li>
          <NavLink to="/all" onClick={() => setIsOpen(false)}>
            Recipe
          </NavLink>
        </li>
        <li>
          <NavLink to="/all/companies" onClick={() => setIsOpen(false)}>
            List of Companies
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/add/recipe" onClick={() => setIsOpen(false)}>
            Add Recipe
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/customers" onClick={() => setIsOpen(false)}>
            Customer List
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" onClick={() => setIsOpen(false)}>
            Dashboard
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
