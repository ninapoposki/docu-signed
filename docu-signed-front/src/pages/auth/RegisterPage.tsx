import React, { useState } from "react";
import styles from "./RegisterPage.module.css";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/AuthService";
import Button from "../../components/button/Button";
import InputField from "../../components/input/InputField";
import SelectField from "../../components/select/SelectField";
import { FieldError, useForm } from "react-hook-form";

interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
}

function RegisterPage() {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    // watch,
    // getValues,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      gender: "",
    },
    mode: "onSubmit",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmitForm = async (data: RegisterFormData) => {
    console.log("Form data:", data);
    //e.preventDefault();
    //validacija
    try {
      await register(data);
      setErrorMessage("");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Registration failed");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Create an account</h2>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className={styles.inputFieldContainer}>
            <InputField
              type="email"
              {...formRegister("email", {
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

          {/* Password Field */}
          <div className={styles.inputFieldContainer}>
            <InputField
              type="password"
              {...formRegister("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /(?=.*[a-z])/,
                  message:
                    "Password must contain at least one lowercase letter",
                },
                validate: (value) => {
                  if (!/[A-Z]/.test(value)) {
                    return "Password must contain at least one uppercase letter";
                  }
                  if (!/[0-9]/.test(value)) {
                    return "Password must contain at least one number";
                  }
                  return true;
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

          {/* First Name Field */}
          <div className={styles.inputFieldContainer}>
            <InputField
              type="text"
              {...formRegister("firstName", {
                required: "First Name is required",
              })}
              placeholder="First Name"
            />
            {errors.firstName && (
              <p className={styles.errorMessage}>
                {(errors.firstName as FieldError)?.message}
              </p>
            )}
          </div>

          {/* Last Name Field */}
          <div className={styles.inputFieldContainer}>
            <InputField
              type="text"
              {...formRegister("lastName", {
                required: "Last Name is required",
              })}
              placeholder="Last Name"
            />
            {errors.lastName && (
              <p className={styles.errorMessage}>
                {(errors.lastName as FieldError)?.message}
              </p>
            )}
          </div>

          {/* Gender Field */}
          <div className={styles.inputFieldContainer}>
            <SelectField
              {...formRegister("gender", {
                required: "Gender is required",
              })}
              placeholder="Gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
            {errors.gender && (
              <p className={styles.errorMessage}>
                {(errors.gender as FieldError)?.message}
              </p>
            )}
          </div>

          <Button type="submit">Register</Button>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
