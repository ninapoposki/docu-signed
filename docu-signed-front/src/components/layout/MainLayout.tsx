import React, { useEffect, useState } from "react";
import styles from "./MainLayout.module.css";
import { Outlet, useNavigate, Link } from "react-router-dom";

const MainLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* <div className={styles.logoContainer}>
          <img
            src={require("../../assets/logodocu.png")}
            alt="DocuSigned Logo"
            className={styles.logoImage}
          />
          <h1 className={styles.logo}>DocuSigned</h1>
        </div> */}
        <div className={styles.logoContainer}>
          <Link to="/" className={styles.logoLink}>
            <img
              src={require("../../assets/logodocu.png")}
              alt="DocuSigned Logo"
              className={styles.logoImage}
            />
            <h1 className={styles.logo}>DocuSigned</h1>
          </Link>
        </div>

        <nav className={styles.navbar}>
          <ul>
            <li>
              <a href="#about" className={styles.navLink}>
                About DocuSigned
              </a>
            </li>
            <li>
              <a href="#contact" className={styles.navLink}>
                Contact Us
              </a>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <Link to="/login" className={styles.navLink}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={styles.navLink}>
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <a onClick={handleLogout} className={styles.navLink}>
                  Logout
                </a>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
