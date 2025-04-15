import React from "react";
import styles from "./SelectField.module.css";
import { SelectFieldProps } from "./SelectField.types";

const SelectField = ({
  name,
  value,
  onChange,
  options,
  required = false,
  placeholder = "",
  className = "",
}: SelectFieldProps) => {
  return (
    // <select
    //   name={name}
    //   value={value}
    //   onChange={onChange}
    //   required={required}
    //   className={`${styles.select} ${className}`}
    // />
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`${styles.select} ${className}`}
    >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
export default SelectField;
