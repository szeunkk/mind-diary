/**
 * Selectbox Component
 * variant: primary, secondary, tertiary
 * size: small, medium, large
 * theme: light, dark
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./styles.module.css";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectboxProps {
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  theme?: "light" | "dark";
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function Selectbox({
  variant = "primary",
  size = "medium",
  theme = "light",
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  disabled = false,
  className,
}: SelectboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    if (!disabled && onChange) {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const selectClasses = [
    styles.select,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${theme}`],
    disabled && styles.disabled,
    isOpen && styles.open,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const dropdownClasses = [
    styles.dropdown,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    styles[`theme-${theme}`],
  ]
    .filter(Boolean)
    .join(" ");

  const optionClasses = (optionValue: string) =>
    [
      styles.option,
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      styles[`variant-${variant}`],
      optionValue === value && styles.selected,
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div className={styles.container} ref={selectRef}>
      <div className={selectClasses} onClick={handleToggle}>
        <div className={styles.content}>
          <span className={styles.text}>{displayText}</span>
          <div className={styles.icon}>
            <Image
              src="/icons/arrow_drop_down.svg"
              alt="dropdown"
              width={24}
              height={24}
              className={styles.iconImage}
            />
          </div>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className={dropdownClasses}>
          {options.map((option) => (
            <div
              key={option.value}
              className={optionClasses(option.value)}
              onClick={() => handleSelect(option.value)}
            >
              <span className={styles.optionText}>{option.label}</span>
              {option.value === value && (
                <div className={styles.checkIcon}>
                  <Image
                    src="/icons/check_outline_light_xs.svg"
                    alt="selected"
                    width={16}
                    height={16}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
