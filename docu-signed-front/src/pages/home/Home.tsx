import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // ako postoji token korisnik je ulogovan
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <img
            src={require("../../assets/logodocu.png")}
            alt="DocuSigned Logo"
            className={styles.logoImage}
          />
          <h1 className={styles.logo}>DocuSigned</h1>{" "}
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
                  <a
                    href="/login"
                    className={`${styles.navLink} ${styles.loginBtn}`}
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    href="/register"
                    className={`${styles.navLink} ${styles.registerBtn}`}
                  >
                    Sign Up
                  </a>
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

      <main className={styles.mainContent}>
        <section className={styles.textSection}>
          <h2 className={styles.mainHeading}>Welcome to DocuSigned!</h2>
          <p className={styles.mainText}>
            DocuSigned provides you with the easiest way to sign documents
            online. Secure, fast, and legally binding. Get started with your
            digital signatures today!
          </p>
          {isLoggedIn && (
            <div className={styles.buttonWrapper}>
              <Button
                onClick={() => (window.location.href = "/upload")}
                className={styles.uploadBtn} // Dodeljuje stilove dugmetu
              >
                Upload Document
              </Button>
            </div>
          )}
        </section>

        {/* <section className={styles.imageSection}>
          <div className={styles.imageBox}>
            <img
              src={require("../../assets/homepagepic.jpg")}
              alt="DocuSigned"
              className={styles.image}
            />
          </div>
        </section> */}
      </main>
    </div>
  );
}

export default Home;
