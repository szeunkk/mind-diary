/**
 * Input Component
 * variant: primary, secondary, tertiary
 * size: small, medium, large
 * theme: light, dark
 */

import React from "react";
import styles from "./styles.module.css";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "primary",
      size = "medium",
      theme = "light",
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputClasses = [
      styles.input,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <input
        ref={ref}
        type="text"
        className={inputClasses}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
