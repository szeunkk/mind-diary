/**
 * Toggle Component
 * variant: primary, secondary, tertiary
 * size: small, medium, large
 * theme: light, dark
 */

import React from "react";
import styles from "./styles.module.css";

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Toggle({
  variant = "primary",
  size = "medium",
  theme = "light",
  checked = false,
  onChange,
  className,
  disabled,
  id,
  ...props
}: ToggleProps) {
  const toggleClasses = [
    styles.toggle,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${theme}`],
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const uniqueId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={toggleClasses}>
      <input
        type="checkbox"
        id={uniqueId}
        className={styles.input}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <label htmlFor={uniqueId} className={styles.label}>
        <span className={styles.knob} />
      </label>
    </div>
  );
}
