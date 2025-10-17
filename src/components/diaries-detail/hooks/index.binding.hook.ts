"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Emotion } from "@/commons/constants/enum";

/**
 * 일기 상세 데이터 타입
 */
export interface DiaryDetailData {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

/**
 * 로컬스토리지에서 일기 데이터를 가져오는 함수
 */
const getDiaryFromLocalStorage = (
  id: string | string[] | undefined
): DiaryDetailData | null => {
  if (!id || typeof window === "undefined") {
    return null;
  }

  try {
    const diariesJson = localStorage.getItem("diaries");
    if (!diariesJson) {
      return null;
    }

    const diaries: DiaryDetailData[] = JSON.parse(diariesJson);
    const foundDiary = diaries.find((diary) => diary.id === Number(id));

    return foundDiary || null;
  } catch (error) {
    console.error("로컬스토리지에서 diaries 데이터를 파싱하는 중 오류:", error);
    return null;
  }
};

/**
 * useDiaryBinding Hook
 *
 * 다이나믹 라우팅된 일기 상세 페이지의 [id]를 추출하여
 * 로컬스토리지에서 실제 데이터를 바인딩합니다.
 *
 * suppressHydrationWarning과 함께 사용하여 SSR 문제 해결
 *
 * @returns 일기 상세 데이터 또는 null
 */
export const useDiaryBinding = (): DiaryDetailData | null => {
  const params = useParams();
  
  // useState lazy initialization을 사용하여 초기 렌더링 시 데이터 로드
  const [diaryData, setDiaryData] = useState<DiaryDetailData | null>(() => {
    // 서버 사이드에서는 항상 null 반환 (SSR 안전)
    if (typeof window === "undefined") {
      return null;
    }
    // 클라이언트에서는 즉시 데이터 로드
    return getDiaryFromLocalStorage(params?.id);
  });

  useEffect(() => {
    // params가 변경될 때 데이터 업데이트
    const newData = getDiaryFromLocalStorage(params?.id);
    setDiaryData(newData);
  }, [params?.id]);

  return diaryData;
};
