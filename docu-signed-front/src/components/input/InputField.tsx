import React, { forwardRef } from 'react';
import styles from './InputField.module.css';
import { InputFieldProps } from './InputField.types';

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      type,
      //      onChange,
      placeholder = '',
      name,
      required = false,
      ...props
    }: InputFieldProps,
    ref
  ) => {
    return (
      <input
        type={type}
        // value={value}
        // onChange={onChange}
        placeholder={placeholder}
        className={`${styles.inputField}`}
        name={name}
        required={required}
        ref={ref}
        {...props}
      />
    );
  }
);
InputField.displayName = 'InputField';
export default InputField;
