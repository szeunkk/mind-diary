"use client";

import { useState, useEffect } from "react";

/**
 * 회고 데이터 타입 (로컬스토리지)
 */
export interface RetrospectData {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 표시용 회고 데이터 타입
 */
export interface DisplayRetrospectData {
  id: number;
  content: string;
  createdAt: string;
}

/**
 * ISO 날짜 문자열을 YYYY. MM. DD 형식으로 변환하는 함수
 * @param dateString - ISO 형식의 날짜 문자열
 * @returns YYYY. MM. DD 형식의 날짜 문자열
 */
const formatRetrospectDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}`;
};

/**
 * useRetrospectBinding Hook
 *
 * 특정 일기의 회고 목록을 로컬스토리지에서 가져오는 커스텀 훅입니다.
 *
 * 기능:
 * 1. 로컬스토리지에서 retrospects 데이터 로드
 * 2. diaryId와 일치하는 회고만 필터링
 * 3. 날짜를 YYYY. MM. DD 형식으로 변환
 * 4. 최신순(id 기준)으로 정렬하여 반환
 *
 * @param diaryId - 일기 ID
 * @returns 해당 일기의 회고 목록 (최신순 정렬)
 */
export const useRetrospectBinding = (
  diaryId: number | null
): DisplayRetrospectData[] => {
  const [retrospectList, setRetrospectList] = useState<DisplayRetrospectData[]>(
    []
  );

  useEffect(() => {
    if (typeof window === "undefined" || diaryId === null) {
      return;
    }

    try {
      const retrospects: RetrospectData[] = JSON.parse(
        localStorage.getItem("retrospects") || "[]"
      );

      // 현재 일기에 해당하는 회고만 필터링
      const filteredRetrospects = retrospects
        .filter((r) => r.diaryId === diaryId)
        .map((r) => ({
          id: r.id,
          content: r.content,
          createdAt: formatRetrospectDate(r.createdAt),
        }))
        .sort((a, b) => b.id - a.id); // 최신순 정렬

      setRetrospectList(filteredRetrospects);
    } catch (error) {
      console.error("회고 목록 로드 중 오류:", error);
    }
  }, [diaryId]);

  return retrospectList;
};
