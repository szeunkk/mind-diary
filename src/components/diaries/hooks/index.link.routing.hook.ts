"use client";

import { useRouter } from "next/navigation";
import { getDiaryDetailUrl } from "@/commons/constants/url";

/**
 * useDiaryRouting Hook
 *
 * 일기 목록에서 일기 상세 페이지로 이동하는 라우팅 기능을 제공합니다.
 * url.ts에 정의된 getDiaryDetailUrl 함수를 사용하여 동적 라우팅을 처리합니다.
 *
 * @returns navigateToDiaryDetail 함수를 포함한 객체
 */
export const useDiaryRouting = () => {
  const router = useRouter();

  /**
   * 일기 상세 페이지로 이동
   * @param id - 일기 ID
   */
  const navigateToDiaryDetail = (id: number): void => {
    router.push(getDiaryDetailUrl(id));
  };

  return { navigateToDiaryDetail };
};
