"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Emotion } from "@/commons/constants/enum";
import { useModal } from "@/commons/providers/modal/modal.provider";
import Modal from "@/commons/components/modal";
import { getDiaryDetailUrl } from "@/commons/constants/url";

// Zod 스키마 정의
const diaryFormSchema = z.object({
  emotion: z.nativeEnum(Emotion, {
    message: "감정을 선택해주세요.",
  }),
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
});

export type DiaryFormData = z.infer<typeof diaryFormSchema>;

// 로컬스토리지 데이터 타입
export interface DiaryItem {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

// 로컬스토리지 키
const DIARIES_STORAGE_KEY = "diaries";

export function useDiaryForm() {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();

  const form = useForm<DiaryFormData>({
    resolver: zodResolver(diaryFormSchema),
    defaultValues: {
      emotion: undefined,
      title: "",
      content: "",
    },
    mode: "onChange",
  });

  const { watch, handleSubmit, formState } = form;

  // 폼 필드 값들 감시
  const watchedValues = watch();

  // 모든 필드가 입력되었고 zod 검증을 통과했는지 확인
  const isFormValid = Boolean(
    watchedValues.emotion &&
      watchedValues.title &&
      watchedValues.title.trim() &&
      watchedValues.content &&
      watchedValues.content.trim()
  );

  // 로컬스토리지에서 기존 diaries 데이터 가져오기
  const getExistingDiaries = (): DiaryItem[] => {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(DIARIES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("로컬스토리지에서 diaries 데이터를 읽는 중 오류:", error);
      throw error; // 에러를 다시 던져서 상위에서 처리할 수 있도록 함
    }
  };

  // 로컬스토리지에 diaries 데이터 저장
  const saveDiariesToStorage = (diaries: DiaryItem[]): void => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(DIARIES_STORAGE_KEY, JSON.stringify(diaries));
    } catch (error) {
      console.error("로컬스토리지에 diaries 데이터를 저장하는 중 오류:", error);
      throw error; // 에러를 다시 던져서 상위에서 처리할 수 있도록 함
    }
  };

  // 새로운 ID 생성 (기존 diaries에서 가장 큰 ID + 1)
  const generateNewId = (existingDiaries: DiaryItem[]): number => {
    if (existingDiaries.length === 0) return 1;

    const maxId = Math.max(...existingDiaries.map((diary) => diary.id));
    return maxId + 1;
  };

  // 등록 완료 모달 표시
  const showSuccessModal = (diaryId: number) => {
    openModal(
      <Modal
        variant="info"
        actions="single"
        title="일기 등록 완료"
        description="등록이 완료 되었습니다."
        confirmText="확인"
        onConfirm={() => {
          closeAllModals(); // 모든 모달 닫기
          // 상세페이지로 이동
          router.push(getDiaryDetailUrl(diaryId));
        }}
      />
    );
  };

  // 폼 제출 핸들러
  const onSubmit = handleSubmit((data: DiaryFormData) => {
    try {
      // 기존 diaries 데이터 가져오기
      const existingDiaries = getExistingDiaries();

      // 새로운 ID 생성
      const newId = generateNewId(existingDiaries);

      // 새로운 일기 데이터 생성
      const newDiary: DiaryItem = {
        id: newId,
        title: data.title.trim(),
        content: data.content.trim(),
        emotion: data.emotion,
        createdAt: new Date().toISOString(),
      };

      // 기존 배열에 새 일기 추가
      const updatedDiaries = [...existingDiaries, newDiary];

      // 로컬스토리지에 저장
      saveDiariesToStorage(updatedDiaries);

      // 등록 완료 모달 표시
      showSuccessModal(newId);

      // 폼 리셋
      form.reset();
    } catch (error) {
      console.error("일기 등록 중 오류 발생:", error);
      // 에러 모달 표시
      openModal(
        <Modal
          variant="danger"
          actions="single"
          title="등록 실패"
          description="일기 등록 중 오류가 발생했습니다. 다시 시도해주세요."
          confirmText="확인"
          onConfirm={() => closeAllModals()}
        />
      );
    }
  });

  return {
    form,
    onSubmit,
    isFormValid,
    formState,
    watchedValues,
  };
}
