/**
 * Modal Component
 * variant: info, danger
 * actions: single, dual
 * theme: light, dark
 */

import React from "react";
import Button from "../button";
import styles from "./styles.module.css";

export interface ModalProps {
  variant?: "info" | "danger";
  actions?: "single" | "dual";
  theme?: "light" | "dark";
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function Modal({
  variant = "info",
  actions = "single",
  theme = "light",
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: ModalProps) {
  const modalClassName = [
    styles.modal,
    styles[`variant-${variant}`],
    styles[`theme-${theme}`],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={modalClassName}>
      <div className={styles.content}>
        <div className={styles.textArea}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        <div
          className={actions === "dual" ? styles.actionsDual : styles.actions}
        >
          {actions === "dual" && (
            <Button
              variant="secondary"
              size="medium"
              theme="light"
              onClick={onCancel}
              className={styles.buttonDual}
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={onConfirm}
            className={actions === "dual" ? styles.buttonDual : styles.button}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
