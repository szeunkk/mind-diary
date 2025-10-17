"use client";

import { useEffect, useState } from "react";
import { Emotion } from "@/commons/constants/enum";

/**
 * 일기 데이터 타입
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

/**
 * 일기 목록 표시용 데이터 타입
 */
export interface DiaryDisplayData {
  id: number;
  emotion: Emotion;
  date: string; // YYYY. MM. DD 형식
  title: string;
}

/**
 * ISO 날짜 문자열을 YYYY. MM. DD 형식으로 변환하는 함수
 * 이미 YYYY. MM. DD 형식인 경우 그대로 반환
 * @param dateString - 날짜 문자열 (ISO 8601 또는 YYYY. MM. DD 형식)
 * @returns YYYY. MM. DD 형식의 날짜 문자열
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
 * useDiaryBinding Hook
 *
 * 로컬스토리지에서 일기 목록 데이터를 가져와서
 * 화면 표시용 형식으로 변환합니다.
 *
 * 클라이언트에서만 데이터를 로드하여 SSR Hydration 문제 해결
 *
 * @returns 일기 목록 표시용 데이터 배열
 */
export const useDiaryBinding = (): DiaryDisplayData[] => {
  const [diaries, setDiaries] = useState<DiaryDisplayData[]>([]);

  useEffect(() => {
    // 클라이언트에서만 데이터 로드
    if (typeof window === "undefined") {
      return;
    }

    try {
      // 로컬스토리지에서 diaries 데이터 가져오기
      const storedDiaries = localStorage.getItem("diaries");

      if (storedDiaries) {
        const parsedDiaries: DiaryData[] = JSON.parse(storedDiaries);

        // 표시용 데이터로 변환
        const displayDiaries: DiaryDisplayData[] = parsedDiaries.map(
          (diary) => ({
            id: diary.id,
            emotion: diary.emotion,
            date: formatDate(diary.createdAt),
            title: diary.title,
          })
        );

        setDiaries(displayDiaries);
      } else {
        setDiaries([]);
      }
    } catch (error) {
      console.error(
        "로컬스토리지에서 diaries 데이터를 파싱하는 중 오류:",
        error
      );
      setDiaries([]);
    }
  }, []);

  return diaries;
};
