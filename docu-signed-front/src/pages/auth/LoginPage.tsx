import React, { useState } from "react";
import { login } from "../../services/AuthService.ts";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";

// import InputField from '../../components/common/InputFiels';
// import Button from '../../components/common/Button';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    try {
      const userToken = await login(email, password);
      setToken(userToken);
      localStorage.setItem("token", userToken);
      setErrorMessage("");
      navigate("/");
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Login failed");
      setToken("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Welcome to DocuSigned!</h2>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.inputField}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className={styles.inputField}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className={styles.button} type="submit">
            Login
          </button>
          <div className={styles.signUpLink}>
            Don’t have an account? Sign Up
          </div>
          {errorMessage && (
            <p className={styles.errorMessage}>{errorMessage}</p>
          )}
          {token && (
            <p className={styles.successMessage}>Logged in successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
