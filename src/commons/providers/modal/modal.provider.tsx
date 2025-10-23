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
  useCallback,
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
  closeAllModals: () => void;
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

  // ESC 키로 최상위 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalStack((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
      }
    };

    if (modalStack.length > 0) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [modalStack.length]);

  const openModal = (content: ReactNode): string => {
    // React 요소에서 title prop 추출 (중복 체크용)
    const getModalTitle = (node: ReactNode): string | null => {
      if (!node || typeof node !== "object") return null;
      if ("props" in node && node.props && typeof node.props === "object") {
        const props = node.props as Record<string, unknown>;
        if (typeof props.title === "string") {
          return props.title;
        }
      }
      return null;
    };

    const newModalTitle = getModalTitle(content);
    const id = `modal-${Date.now()}-${Math.random()}`;
    let returnId = id;

    setModalStack((prev) => {
      // 같은 title을 가진 모달이 이미 스택에 있으면 추가하지 않음
      if (newModalTitle) {
        const existingModal = prev.find((modal) => {
          const existingTitle = getModalTitle(modal.content);
          return existingTitle === newModalTitle;
        });

        if (existingModal) {
          console.log(
            `[ModalProvider] 중복 모달 방지: "${newModalTitle}"가 이미 존재합니다.`
          );
          returnId = existingModal.id;
          return prev; // 스택 변경 없음
        }
      }

      // 새 모달 추가
      return [...prev, { id, content }];
    });

    return returnId;
  };

  const closeModal = useCallback((id: string) => {
    setModalStack((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const closeTopModal = useCallback(() => {
    setModalStack((prev) => prev.slice(0, -1));
  }, []);

  const closeAllModals = useCallback(() => {
    setModalStack([]);
  }, []);

  const value = {
    openModal,
    closeModal,
    closeTopModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isMounted &&
        modalStack.length > 0 &&
        createPortal(
          <div className={styles.portalContainer}>
            {/* 각 모달마다 backdrop과 wrapper를 페어로 렌더링 */}
            {modalStack.map((modal, index) => (
              <React.Fragment key={modal.id}>
                {/* 각 모달의 backdrop */}
                <div
                  className={styles.backdrop}
                  style={{ zIndex: 1000 + index * 2 }}
                  onClick={
                    index === modalStack.length - 1 ? closeTopModal : undefined
                  }
                />
                {/* 각 모달의 컨텐츠 */}
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
