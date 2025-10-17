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
 * ISO 날짜 문자열을 YYYY. MM. DD 형식으로 변환하는 함수
 * 이미 YYYY. MM. DD 형식인 경우 그대로 반환
 */
const formatDate = (dateString: string): string => {
  // 이미 "YYYY. MM. DD" 형식인지 확인 (정규표현식)
  const formattedPattern = /^\d{4}\.\s\d{2}\.\s\d{2}$/;
  if (formattedPattern.test(dateString)) {
    return dateString;
  }

  // ISO 형식을 YYYY. MM. DD로 변환
  const date = new Date(dateString);

  // Invalid Date 체크
  if (isNaN(date.getTime())) {
    return dateString; // 파싱 실패 시 원본 반환
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}`;
};

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

    if (!foundDiary) {
      return null;
    }

    // createdAt을 YYYY. MM. DD 형식으로 변환
    return {
      ...foundDiary,
      createdAt: formatDate(foundDiary.createdAt),
    };
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
 * 클라이언트에서만 데이터를 로드하여 SSR Hydration 문제 해결
 *
 * @returns 일기 상세 데이터 또는 null
 */
export const useDiaryBinding = (): DiaryDetailData | null => {
  const params = useParams();
  const [diaryData, setDiaryData] = useState<DiaryDetailData | null>(null);

  useEffect(() => {
    // 클라이언트에서만 데이터 로드 (마운트 즉시 실행)
    const newData = getDiaryFromLocalStorage(params?.id);
    setDiaryData(newData);
  }, [params?.id]);

  return diaryData;
};
