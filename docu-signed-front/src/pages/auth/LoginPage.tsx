import React, { useState } from "react";
import { login } from "../../services/AuthService";
// import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import Button from "../../components/button/Button";
import InputField from "../../components/input/InputField";
import { FieldError, useForm } from "react-hook-form";

function LoginPage() {
  //react-hook-form

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const { email, password } = data;
    console.log("Form data:", data);

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputFieldContainer}>
            <InputField
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
              placeholder="Email"
            />
            {errors.email && (
              <p className={styles.errorMessage}>
                {(errors.email as FieldError)?.message}
              </p>
            )}
          </div>

          <div className={styles.inputFieldContainer}>
            <InputField
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Password"
            />
            {errors.password && (
              <p className={styles.errorMessage}>
                {(errors.password as FieldError)?.message}
              </p>
            )}
          </div>

          <Button type="submit">Login</Button>
          <div className={styles.signUpLink}>
            Don’t have an account? <Link to="/register">Sign Up</Link>
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
