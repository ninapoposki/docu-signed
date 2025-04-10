import React from "react";
import styles from "./Button.module.css";
import { ButtonProps } from "./Button.types";

const Button = ({
  type = "button",
  disabled = false,
  onClick,
  children,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${styles.button}`}
    >
      {children}
    </button>
  );
};
export default Button;
