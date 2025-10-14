/**
 * SearchBar Component
 * variant: primary, secondary, tertiary
 * size: small, medium, large
 * theme: light, dark
 */

import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
  onSearch?: (value: string) => void;
}

export default function SearchBar({
  variant = "primary",
  size = "medium",
  theme = "light",
  className,
  disabled,
  placeholder = "검색어를 입력해 주세요.",
  onSearch,
  ...props
}: SearchBarProps) {
  const containerClasses = [
    styles.container,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${theme}`],
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(e.currentTarget.value);
    }
    props.onKeyPress?.(e);
  };

  return (
    <div className={containerClasses}>
      <div className={styles.iconWrapper}>
        <Image
          src="/icons/search_outline_light_m.svg"
          alt="search icon"
          width={24}
          height={24}
          className={styles.icon}
        />
      </div>
      <input
        className={styles.input}
        disabled={disabled}
        placeholder={placeholder}
        onKeyPress={handleKeyPress}
        {...props}
      />
    </div>
  );
}
