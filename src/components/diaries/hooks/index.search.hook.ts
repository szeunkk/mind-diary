"use client";

import { useState, useCallback, useEffect } from "react";
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
  date: string;
  title: string;
}

/**
 * ISO 날짜 문자열을 YYYY. MM. DD 형식으로 변환하는 함수
 * @param dateString - 날짜 문자열
 * @returns YYYY. MM. DD 형식의 날짜 문자열
 */
const formatDate = (dateString: string): string => {
  const formattedPattern = /^\d{4}\.\s\d{2}\.\s\d{2}$/;
  if (formattedPattern.test(dateString)) {
    return dateString;
  }

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
 * useDiarySearch Hook
 *
 * 일기 검색 기능을 제공합니다.
 * - 로컬스토리지에서 일기 데이터를 로드
 * - 검색어에 따라 title이 포함된 일기를 필터링
 * - 검색어가 없으면 모든 일기를 반환
 *
 * @returns {Object} 검색 관련 상태 및 함수
 * @returns {DiaryDisplayData[]} filteredDiaries - 필터링된 일기 목록
 * @returns {string} searchKeyword - 현재 검색어
 * @returns {function} handleSearch - 검색 실행 함수
 */
export const useDiarySearch = () => {
  const [allDiaries, setAllDiaries] = useState<DiaryDisplayData[]>([]);
  const [filteredDiaries, setFilteredDiaries] = useState<DiaryDisplayData[]>(
    []
  );
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // 로컬스토리지에서 일기 데이터 로드
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedDiaries = localStorage.getItem("diaries");

      if (storedDiaries) {
        const parsedDiaries: DiaryData[] = JSON.parse(storedDiaries);

        const displayDiaries: DiaryDisplayData[] = parsedDiaries.map(
          (diary) => ({
            id: diary.id,
            emotion: diary.emotion,
            date: formatDate(diary.createdAt),
            title: diary.title,
          })
        );

        setAllDiaries(displayDiaries);
        setFilteredDiaries(displayDiaries);
      } else {
        setAllDiaries([]);
        setFilteredDiaries([]);
      }
    } catch (error) {
      console.error("로컬스토리지에서 diaries 데이터 파싱 오류:", error);
      setAllDiaries([]);
      setFilteredDiaries([]);
    }
  }, []);

  // 검색 실행 함수
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);

      if (!keyword || keyword.trim() === "") {
        // 검색어가 없으면 모든 일기 표시
        setFilteredDiaries(allDiaries);
      } else {
        // 검색어가 title에 포함된 일기만 필터링
        const filtered = allDiaries.filter((diary) =>
          diary.title.includes(keyword)
        );
        setFilteredDiaries(filtered);
      }
    },
    [allDiaries]
  );

  return {
    filteredDiaries,
    searchKeyword,
    handleSearch,
  };
};

