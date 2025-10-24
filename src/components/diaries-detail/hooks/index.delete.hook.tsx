"use client";

import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import Button from "@/commons/components/button";
import { DIARIES } from "@/commons/constants/url";
import { DiaryDetailData } from "./index.binding.hook";
import styles from "../styles.module.css";

/**
 * localStorage에서 일기 목록 가져오기
 * @returns 일기 데이터 배열
 */
const getDiaries = (): DiaryDetailData[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem("diaries");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("일기 데이터를 가져오는 중 오류:", error);
    return [];
  }
};

/**
 * localStorage에 일기 목록 저장하기
 * @param diaries - 저장할 일기 데이터 배열
 */
const saveDiaries = (diaries: DiaryDetailData[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem("diaries", JSON.stringify(diaries));
  } catch (error) {
    console.error("일기 데이터를 저장하는 중 오류:", error);
  }
};

/**
 * useDeleteDiary Hook
 *
 * 일기 삭제 기능을 관리하는 커스텀 훅입니다.
 * Modal Provider를 사용하여 삭제 확인 모달을 표시합니다.
 *
 * 기능:
 * 1. 삭제 모달 표시
 * 2. 일기 삭제 (localStorage에서 제거)
 * 3. 삭제 후 /diaries로 페이지 이동
 *
 * @returns 삭제 모달 관리 객체
 */
export const useDeleteDiary = () => {
  const params = useParams();
  const router = useRouter();
  const { openModal, closeTopModal } = useModal();

  // diaryId 파싱
  let diaryId: number | null = null;
  if (params?.id) {
    diaryId = Number(params.id);
  } else if (typeof window !== "undefined") {
    const segments = window.location.pathname.split("/");
    const maybeId = segments[segments.length - 1];
    const parsed = Number(maybeId);
    diaryId = Number.isNaN(parsed) ? null : parsed;
  }

  /**
   * 실제 삭제 처리 함수
   */
  const handleConfirmDelete = () => {
    if (!diaryId) {
      console.error("일기 ID를 찾을 수 없습니다.");
      return;
    }

    try {
      // 기존 일기 목록 가져오기
      const diaries = getDiaries();

      // 해당 일기를 제외한 새 목록 생성
      const updatedDiaries = diaries.filter((diary) => diary.id !== diaryId);

      // localStorage에 저장
      saveDiaries(updatedDiaries);

      // 모달 닫기
      closeTopModal();

      // /diaries로 페이지 이동
      router.push(DIARIES);
    } catch (error) {
      console.error("일기 삭제 중 오류:", error);
    }
  };

  /**
   * 삭제 취소 함수
   */
  const handleCancelDelete = () => {
    closeTopModal();
  };

  /**
   * 삭제 모달 열기
   */
  const handleOpenDeleteModal = () => {
    openModal(
      <div className={styles.deleteModal} data-testid="delete-modal">
        <div className={styles.deleteModalContent}>
          <h2
            className={styles.deleteModalTitle}
            data-testid="delete-modal-title"
          >
            일기 삭제
          </h2>
          <p
            className={styles.deleteModalDescription}
            data-testid="delete-modal-description"
          >
            일기를 삭제 하시겠어요?
          </p>
        </div>
        <div className={styles.deleteModalButtons}>
          <Button
            variant="tertiary"
            size="medium"
            theme="light"
            onClick={handleCancelDelete}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleConfirmDelete}
          >
            삭제
          </Button>
        </div>
      </div>
    );
  };

  return {
    handleOpenDeleteModal,
  };
};
