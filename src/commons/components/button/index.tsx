import React from "react";
import styles from "./styles.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "medium",
  theme = "light",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  const buttonClassName = [
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${theme}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClassName} {...props}>
      <div className={styles.content}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <span className={styles.text}>{children}</span>
      </div>
    </button>
  );
}
