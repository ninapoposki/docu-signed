import React, { forwardRef } from "react";
import styles from "./SelectField.module.css";
import { SelectFieldProps } from "./SelectField.types";

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      name,
      // value,
      // onChange,
      options,
      required = false,
      placeholder = "",
      className = "",
      ...props
    }: SelectFieldProps,
    ref
  ) => {
    return (
      <select
        name={name}
        required={required}
        className={`${styles.select} ${className}`}
        ref={ref}
        {...props}
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
  }
);
SelectField.displayName = "SelectField";
export default SelectField;
