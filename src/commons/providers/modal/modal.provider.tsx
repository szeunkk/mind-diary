"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalContextType {
  isOpen: boolean;
  content: ReactNode | null;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export default function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const openModal = (modalContent: ReactNode) => {
    setContent(modalContent);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
  };

  const value = {
    isOpen,
    content,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isMounted &&
        isOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 배경 오버레이 */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={closeModal}
            />
            {/* 모달 컨텐츠 (max-w-md, w-full 제거됨) */}
            <div className="relative z-10 bg-white rounded-lg shadow-lg">
              {content}
            </div>
          </div>,
          document.body
        )}
    </ModalContext.Provider>
  );
}
