"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";

/**
 * 회고 데이터 타입
 */
export interface RetrospectData {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 회고 폼 입력 데이터 타입
 */
export interface RetrospectFormInput {
  content: string;
}

/**
 * Zod 스키마: 회고 입력 검증
 */
const retrospectSchema = z.object({
  content: z.string().min(1, "회고 내용을 입력해주세요."),
});

/**
 * localStorage에서 회고 목록 가져오기
 * @returns 회고 데이터 배열
 */
const getRetrospects = (): RetrospectData[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem("retrospects");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("회고 데이터를 가져오는 중 오류:", error);
    return [];
  }
};

/**
 * localStorage에 회고 목록 저장하기
 * @param retrospects - 저장할 회고 데이터 배열
 */
const saveRetrospects = (retrospects: RetrospectData[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem("retrospects", JSON.stringify(retrospects));
  } catch (error) {
    console.error("회고 데이터를 저장하는 중 오류:", error);
  }
};

/**
 * 다음 회고 ID 가져오기
 * @param retrospects - 기존 회고 데이터 배열
 * @returns 다음에 사용할 회고 ID
 */
const getNextRetrospectId = (retrospects: RetrospectData[]): number => {
  if (retrospects.length === 0) {
    return 1;
  }

  const maxId = Math.max(...retrospects.map((r) => r.id));
  return maxId + 1;
};

/**
 * 현재 날짜를 ISO 형식으로 반환
 * @returns ISO 8601 형식의 날짜 문자열
 */
const getCurrentISODate = (): string => {
  return new Date().toISOString();
};

/**
 * useRetrospectForm Hook
 *
 * 회고 폼을 관리하는 커스텀 훅입니다.
 * react-hook-form과 zod를 사용하여 폼 상태와 검증을 처리합니다.
 *
 * 기능:
 * 1. 회고 입력 폼 관리 (react-hook-form)
 * 2. 입력 검증 (zod)
 * 3. 회고 등록 (localStorage에 저장)
 * 4. 등록 후 페이지 새로고침
 *
 * @returns 폼 관리 객체
 */
export const useRetrospectForm = () => {
  const params = useParams();
  // diaryId 파싱
  // Next.js App Router에서 클라이언트 측 첫 렌더링 시 params 가 undefined 인 경우가 있으므로
  // window.location.pathname 을 통해 Fallback 하도록 보강한다.
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
  } = useForm<RetrospectFormInput>({
    resolver: zodResolver(retrospectSchema),
    mode: "onChange", // 실시간 검증
    defaultValues: {
      content: "",
    },
  });

  // 입력값 감시 (버튼 활성화 여부 판단용)
  const content = watch("content");
  const isSubmitEnabled = isValid && content.trim().length > 0;

  /**
   * 회고 등록 핸들러
   */
  const onSubmit = (data: RetrospectFormInput) => {
    if (!diaryId) {
      console.error("일기 ID를 찾을 수 없습니다.");
      return;
    }

    try {
      // 기존 회고 목록 가져오기
      const existingRetrospects = getRetrospects();

      // 새로운 회고 생성
      const newRetrospect: RetrospectData = {
        id: getNextRetrospectId(existingRetrospects),
        content: data.content.trim(),
        diaryId: diaryId,
        createdAt: getCurrentISODate(),
      };

      // 회고 목록에 추가
      const updatedRetrospects = [...existingRetrospects, newRetrospect];

      // localStorage에 저장
      saveRetrospects(updatedRetrospects);

      // 폼 초기화
      reset();

      // 페이지 새로고침
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      console.error("회고 등록 중 오류:", error);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isSubmitEnabled,
    content,
  };
};
