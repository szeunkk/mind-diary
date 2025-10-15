"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
import DiariesNew from "@/components/diaries-new";

/**
 * 일기쓰기 모달 관리 Hook
 *
 * 이 Hook은 일기쓰기 모달을 열고 닫는 기능을 제공합니다.
 * ModalProvider의 useModal을 사용하여 모달을 관리합니다.
 */
export const useDiaryWriteModal = () => {
  const { openModal, closeModal } = useModal();

  /**
   * 일기쓰기 모달을 엽니다.
   */
  const openDiaryWriteModal = () => {
    openModal(<DiariesNew />);
  };

  return {
    openDiaryWriteModal,
    closeModal,
  };
};
