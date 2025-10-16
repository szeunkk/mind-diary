/**
 * 일기쓰기 모달 닫기 기능 Hook
 *
 * 이 Hook은 일기쓰기 모달의 닫기 기능과 2중 모달 스택 관리를 담당합니다.
 * 닫기 버튼 클릭 시 등록취소 모달을 2중 모달로 표시하고,
 * 등록취소 모달의 계속작성/등록취소 버튼 처리를 제공합니다.
 */

"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
import Modal from "@/commons/components/modal";
import { useState, useEffect } from "react";

export interface UseModalCloseReturn {
  handleClose: () => void;
  isConfirmModalOpen: boolean;
}

export const useModalClose = (): UseModalCloseReturn => {
  const { openModal, closeTopModal, closeModal } = useModal();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  /**
   * 모달이 닫힐 때 상태를 리셋합니다.
   * backdrop 클릭이나 다른 방식으로 모달이 닫힌 경우를 감지합니다.
   */
  useEffect(() => {
    if (isConfirmModalOpen) {
      const checkModalStatus = () => {
        const modalElements = document.querySelectorAll('[class*="modal"]');
        const hasConfirmModal = Array.from(modalElements).some((element) =>
          element.textContent?.includes("일기 등록 취소")
        );

        if (!hasConfirmModal) {
          setIsConfirmModalOpen(false);
        }
      };

      // 주기적으로 모달 상태 확인 (backdrop 클릭 등으로 닫힌 경우 감지)
      const interval = setInterval(checkModalStatus, 100);

      return () => clearInterval(interval);
    }
  }, [isConfirmModalOpen]);

  /**
   * 닫기 버튼 클릭 시 등록취소 모달을 표시합니다.
   */
  const handleClose = () => {
    if (isConfirmModalOpen) {
      return; // 이미 확인 모달이 열려있으면 중복 실행 방지
    }

    setIsConfirmModalOpen(true);

    const modalId = openModal(
      <Modal
        variant="info"
        actions="dual"
        title="일기 등록 취소"
        description="일기 등록을 취소 하시겠어요?"
        confirmText="등록 취소"
        cancelText="계속 작성"
        onConfirm={() => {
          // 등록취소: 모든 모달 닫기
          closeModal(modalId);
          closeTopModal(); // 일기쓰기 폼 모달도 닫기
          setIsConfirmModalOpen(false);
        }}
        onCancel={() => {
          // 계속작성: 확인 모달만 닫기
          closeModal(modalId);
          setIsConfirmModalOpen(false);
        }}
      />
    );
  };

  return {
    handleClose,
    isConfirmModalOpen,
  };
};
