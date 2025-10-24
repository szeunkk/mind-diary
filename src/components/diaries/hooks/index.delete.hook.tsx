/**
 * 일기 삭제 Hook
 *
 * 일기 삭제 기능을 제공합니다.
 * - 로그인된 사용자: 삭제 버튼 노출, 삭제 모달 열기, 삭제 처리
 * - 비로그인 사용자: 삭제 버튼 미노출
 * useModal, useAuthGuard를 사용하여 권한을 검증합니다.
 */

"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
import { useAuthGuard } from "@/commons/providers/auth/auth.guard.hook";
import { useAuth } from "@/commons/providers/auth/auth.provider";
import Modal from "@/commons/components/modal";

/**
 * useDiaryDelete Hook의 반환 타입
 */
export interface UseDiaryDeleteReturn {
  /**
   * 삭제 모달을 엽니다.
   * @param diaryId 삭제할 일기의 ID
   */
  openDeleteModal: (diaryId: number) => void;

  /**
   * 삭제 버튼의 노출 여부를 반환합니다.
   * @returns 로그인 상태일 경우 true, 아니면 false
   */
  isDeleteVisible: boolean;
}

/**
 * 일기 삭제 관리 Hook (권한 분기 적용)
 *
 * 이 Hook은 일기 삭제 모달을 열고 실제 삭제 처리를 제공합니다.
 * - 로그인된 사용자: 삭제 버튼 노출, 삭제 모달을 엽니다.
 * - 비로그인 사용자: 삭제 버튼 미노출
 * ModalProvider의 useModal과 useAuthGuard를 사용하여 권한을 검증합니다.
 *
 * @returns openDeleteModal, isDeleteVisible를 포함한 객체
 */
export const useDiaryDelete = (): UseDiaryDeleteReturn => {
  const { openModal, closeAllModals } = useModal();
  const { checkAuth } = useAuthGuard();
  const { isLoggedIn } = useAuth();

  /**
   * 로컬스토리지에서 일기를 삭제하고 페이지를 새로고침합니다.
   * @param diaryId 삭제할 일기의 ID
   */
  const handleDelete = (diaryId: number) => {
    try {
      // localStorage에서 diaries 가져오기
      const diariesJson = localStorage.getItem("diaries");
      if (!diariesJson) {
        console.error("일기 목록을 찾을 수 없습니다.");
        return;
      }

      // JSON 파싱
      const diaries = JSON.parse(diariesJson);

      // 해당 ID를 제외한 일기들만 필터링
      const filteredDiaries = diaries.filter(
        (diary: { id: number }) => diary.id !== diaryId
      );

      // 업데이트된 일기 목록을 localStorage에 저장
      localStorage.setItem("diaries", JSON.stringify(filteredDiaries));

      // 모달 닫기
      closeAllModals();

      // 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("일기 삭제 중 오류가 발생했습니다:", error);
    }
  };

  /**
   * 삭제 모달을 엽니다.
   * 권한 검증 후, 로그인된 경우에만 삭제 모달을 엽니다.
   */
  const openDeleteModal = (diaryId: number) => {
    // 권한 검증
    const isAuthenticated = checkAuth();

    // 로그인된 경우에만 삭제 모달 열기
    if (isAuthenticated) {
      openModal(
        <Modal
          variant="danger"
          actions="dual"
          theme="light"
          title="일기 삭제"
          description="일기를 삭제 하시겠어요?"
          confirmText="삭제"
          cancelText="취소"
          onConfirm={() => handleDelete(diaryId)}
          onCancel={() => closeAllModals()}
        />
      );
    }
    // 비로그인 상태인 경우 checkAuth에서 로그인 요청 모달을 자동으로 표시
  };

  // 삭제 버튼 노출 여부 (로그인 상태 + localStorage 체크)
  const hasAccessToken =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");
  const isDeleteVisible = isLoggedIn || hasAccessToken;

  return {
    openDeleteModal,
    isDeleteVisible,
  };
};

