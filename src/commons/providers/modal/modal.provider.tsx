/**
 * Modal Provider Stack Component
 * 중첩 모달 지원, 스택 기반 모달 관리
 * 각 모달마다 독립적인 backdrop과 zIndex 관리
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

interface ModalItem {
  id: string;
  content: ReactNode;
}

export interface ModalContextType {
  openModal: (content: ReactNode) => string;
  closeModal: (id: string) => void;
  closeTopModal: () => void;
}

export interface ModalProviderProps {
  children: ReactNode;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};

export default function ModalProvider({ children }: ModalProviderProps) {
  const [modalStack, setModalStack] = useState<ModalItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (modalStack.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalStack.length]);

  const openModal = (content: ReactNode): string => {
    const id = `modal-${Date.now()}-${Math.random()}`;
    setModalStack((prev) => [...prev, { id, content }]);
    return id;
  };

  const closeModal = (id: string) => {
    setModalStack((prev) => prev.filter((modal) => modal.id !== id));
  };

  const closeTopModal = () => {
    setModalStack((prev) => prev.slice(0, -1));
  };

  const value = {
    openModal,
    closeModal,
    closeTopModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isMounted &&
        modalStack.length > 0 &&
        createPortal(
          <div className={styles.portalContainer}>
            {modalStack.map((modal, index) => (
              <React.Fragment key={modal.id}>
                <div
                  className={styles.backdrop}
                  style={{ zIndex: 1000 + index * 2 }}
                  onClick={() => closeModal(modal.id)}
                />
                <div
                  className={styles.modalWrapper}
                  style={{ zIndex: 1000 + index * 2 + 1 }}
                >
                  {modal.content}
                </div>
              </React.Fragment>
            ))}
          </div>,
          document.body
        )}
    </ModalContext.Provider>
  );
}
