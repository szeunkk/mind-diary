"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";
import { Emotion } from "@/commons/constants/enum";
import { DiaryDetailData } from "./index.binding.hook";

/**
 * 일기 수정 폼 입력 데이터 타입
 */
export interface DiaryUpdateFormInput {
  emotion: Emotion;
  title: string;
  content: string;
}

/**
 * Zod 스키마: 일기 수정 입력 검증
 */
const diaryUpdateSchema = z.object({
  emotion: z.nativeEnum(Emotion),
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
});

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
 * localStorage에서 특정 일기 가져오기
 * @param id - 일기 ID
 * @returns 일기 데이터 또는 null
 */
const getDiaryById = (id: number): DiaryDetailData | null => {
  const diaries = getDiaries();
  return diaries.find((diary) => diary.id === id) || null;
};

/**
 * useUpdateDiary Hook
 *
 * 일기 수정 폼을 관리하는 커스텀 훅입니다.
 * react-hook-form과 zod를 사용하여 폼 상태와 검증을 처리합니다.
 *
 * 기능:
 * 1. 일기 수정 모드 전환 (isEditMode)
 * 2. 일기 수정 폼 관리 (react-hook-form)
 * 3. 입력 검증 (zod)
 * 4. 일기 수정 (localStorage에 저장)
 * 5. 수정 후 페이지 새로고침
 *
 * @returns 수정 폼 관리 객체
 */
export const useUpdateDiary = () => {
  const params = useParams();
  const [isEditMode, setIsEditMode] = useState(false);

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

  // react-hook-form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
    setValue,
  } = useForm<DiaryUpdateFormInput>({
    resolver: zodResolver(diaryUpdateSchema),
    mode: "onChange", // 실시간 검증
    defaultValues: {
      emotion: Emotion.Happy,
      title: "",
      content: "",
    },
  });

  // 현재 일기 데이터 로드
  useEffect(() => {
    if (diaryId && isEditMode) {
      const diary = getDiaryById(diaryId);
      if (diary) {
        setValue("emotion", diary.emotion);
        setValue("title", diary.title);
        setValue("content", diary.content);
      }
    }
  }, [diaryId, isEditMode, setValue]);

  // 입력값 감시 (버튼 활성화 여부 판단용)
  const title = watch("title");
  const content = watch("content");
  const emotion = watch("emotion");
  const isSubmitEnabled =
    isValid && title.trim().length > 0 && content.trim().length > 0;

  /**
   * 수정 모드 진입 핸들러
   */
  const handleEdit = () => {
    setIsEditMode(true);
  };

  /**
   * 수정 취소 핸들러
   */
  const handleCancel = () => {
    setIsEditMode(false);
    reset();
  };

  /**
   * 일기 수정 핸들러
   */
  const onSubmit = (data: DiaryUpdateFormInput) => {
    if (!diaryId) {
      console.error("일기 ID를 찾을 수 없습니다.");
      return;
    }

    try {
      // 기존 일기 목록 가져오기
      const diaries = getDiaries();

      // 수정할 일기 찾기
      const targetIndex = diaries.findIndex((diary) => diary.id === diaryId);

      if (targetIndex === -1) {
        console.error("수정할 일기를 찾을 수 없습니다.");
        return;
      }

      // 일기 수정 (createdAt과 id는 유지)
      const updatedDiary: DiaryDetailData = {
        ...diaries[targetIndex],
        emotion: data.emotion,
        title: data.title.trim(),
        content: data.content.trim(),
      };

      // 일기 목록 업데이트
      diaries[targetIndex] = updatedDiary;

      // localStorage에 저장
      saveDiaries(diaries);

      // 수정 모드 종료 및 폼 초기화
      setIsEditMode(false);
      reset();

      // 페이지 새로고침
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      console.error("일기 수정 중 오류:", error);
    }
  };

  return {
    isEditMode,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isSubmitEnabled,
    handleEdit,
    handleCancel,
    emotion,
    title,
    content,
  };
};
