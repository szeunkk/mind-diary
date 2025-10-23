"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
import { useAuthGuard } from "@/commons/providers/auth/auth.guard.hook";
import DiariesNew from "@/components/diaries-new";

/**
 * useDiaryWriteModal Hook의 반환 타입
 */
export interface UseDiaryWriteModalReturn {
  openDiaryWriteModal: () => void;
  closeModal: (id: string) => void;
}

/**
 * 일기쓰기 모달 관리 Hook (권한 분기 적용)
 *
 * 이 Hook은 일기쓰기 모달을 열고 닫는 기능을 제공합니다.
 * - 로그인된 사용자: 일기쓰기 모달을 엽니다.
 * - 비로그인 사용자: 로그인 요청 모달을 엽니다.
 * ModalProvider의 useModal과 useAuthGuard를 사용하여 권한을 검증합니다.
 *
 * @returns openDiaryWriteModal, closeModal 함수를 포함한 객체
 */
export const useDiaryWriteModal = (): UseDiaryWriteModalReturn => {
  const { openModal, closeModal } = useModal();
  const { checkAuth } = useAuthGuard();

  /**
   * 일기쓰기 모달을 엽니다.
   * 권한 검증 후, 로그인된 경우에만 일기쓰기 모달을 엽니다.
   */
  const openDiaryWriteModal = () => {
    // 권한 검증
    const isAuthenticated = checkAuth();

    // 로그인된 경우에만 일기쓰기 모달 열기
    if (isAuthenticated) {
      openModal(<DiariesNew />);
    }
    // 비로그인 상태인 경우 checkAuth에서 로그인 요청 모달을 자동으로 표시
  };

  return {
    openDiaryWriteModal,
    closeModal,
  };
};
