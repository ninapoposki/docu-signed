import React, { useState } from "react";
import styles from "./RegisterPage.module.css";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/AuthService";
import Button from "../../components/button/Button";
import InputField from "../../components/input/InputField";
import SelectField from "../../components/select/SelectField";

//VALIDACIJA!!!!
function RegisterPage() {
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //validacija
    try {
      await register(form);
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
        <form onSubmit={handleSubmit}>
          <InputField
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <InputField
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <InputField
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
          <InputField
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />

          {/* <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select> */}
          <SelectField
            name="gender"
            value={form.gender}
            onChange={handleChange}
            placeholder="Gender"
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
          ></SelectField>

          <Button type="submit">Register</Button>

          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
