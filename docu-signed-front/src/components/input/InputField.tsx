import React from "react";
import styles from "./InputField.module.css";
import { InputFieldProps } from "./InputField.types";

const InputField = ({
  type,
  value,
  onChange,
  placeholder = "",
  name,
  required = false,
}: InputFieldProps) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${styles.inputField}`}
      name={name}
      required={required}
    />
  );
};

export default InputField;
