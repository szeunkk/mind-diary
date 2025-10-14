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

export default function Input({
  variant = "primary",
  size = "medium",
  theme = "light",
  className,
  disabled,
  ...props
}: InputProps) {
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

  return <input className={inputClasses} disabled={disabled} {...props} />;
}
