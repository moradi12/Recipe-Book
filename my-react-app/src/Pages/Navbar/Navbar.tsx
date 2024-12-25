import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../../Utiles/authService";
import styles from "./Navbar.module.css";

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

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    navigate("/login");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.querySelector(`.${styles.navbar}`);
      if (navbar && !navbar.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <NavLink to="/" onClick={() => setIsOpen(false)}>
          Dessert Delights
        </NavLink>
      </div>

      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </div>

      <ul className={`${styles.navLinks} ${isOpen ? styles.active : ""}`}>
        {/* Existing Links */}
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




        <li>
          <NavLink to="/add" onClick={() => setIsOpen(false)}>
            Add 
          </NavLink>
        </li>



        {/* New Links */}
        <li>
          <NavLink to="/create-recipe" onClick={() => setIsOpen(false)}>
            Create Recipe
          </NavLink>
        </li>
        <li>
          <NavLink to="/all-recipes" onClick={() => setIsOpen(false)}>
            View All Recipes
          </NavLink>
        </li>
        <li>
          <NavLink to="/categories" onClick={() => setIsOpen(false)}>
            Categories
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

        <li className={styles.divider}>|</li>
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
