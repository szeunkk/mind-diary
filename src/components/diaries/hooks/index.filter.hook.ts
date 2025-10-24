"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Emotion, emotionMetadata } from "@/commons/constants/enum";

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
 * 필터 옵션 타입
 */
export interface FilterOption {
  value: string;
  label: string;
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
 * useDiaryFilter Hook
 *
 * 일기 필터 기능을 제공합니다.
 * - 로컬스토리지에서 일기 데이터를 로드
 * - 감정(emotion)에 따라 일기를 필터링
 * - 검색어와 필터를 동시에 적용 가능
 *
 * @returns {Object} 필터 관련 상태 및 함수
 * @returns {DiaryDisplayData[]} filteredDiaries - 필터링된 일기 목록
 * @returns {FilterOption[]} filterOptions - 필터 옵션 목록
 * @returns {string} selectedFilter - 현재 선택된 필터
 * @returns {function} handleFilterChange - 필터 변경 함수
 * @returns {function} handleSearch - 검색 함수
 */
export const useDiaryFilter = () => {
  const [allDiaries, setAllDiaries] = useState<DiaryDisplayData[]>([]);
  const [filteredDiaries, setFilteredDiaries] = useState<DiaryDisplayData[]>(
    []
  );
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // 필터 옵션 생성 (enum.ts의 emotionMetadata 사용)
  // useMemo로 메모이제이션하여 불필요한 재생성 방지
  const filterOptions: FilterOption[] = useMemo(
    () => [
      { value: "all", label: "전체" },
      { value: Emotion.Happy, label: emotionMetadata[Emotion.Happy].label },
      { value: Emotion.Sad, label: emotionMetadata[Emotion.Sad].label },
      {
        value: Emotion.Surprise,
        label: emotionMetadata[Emotion.Surprise].label,
      },
      { value: Emotion.Angry, label: emotionMetadata[Emotion.Angry].label },
      { value: Emotion.Etc, label: emotionMetadata[Emotion.Etc].label },
    ],
    []
  );

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

  // 필터링 로직 적용 함수
  const applyFilters = useCallback(
    (diaries: DiaryDisplayData[], filter: string, keyword: string) => {
      let result = diaries;

      // 검색어 필터링
      if (keyword && keyword.trim() !== "") {
        result = result.filter((diary) => diary.title.includes(keyword));
      }

      // 감정 필터링
      if (filter !== "all") {
        result = result.filter((diary) => diary.emotion === filter);
      }

      return result;
    },
    []
  );

  // 필터 변경 함수
  const handleFilterChange = useCallback(
    (filter: string) => {
      setSelectedFilter(filter);

      const filtered = applyFilters(allDiaries, filter, searchKeyword);
      setFilteredDiaries(filtered);
    },
    [allDiaries, searchKeyword, applyFilters]
  );

  // 검색 함수
  const handleSearch = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);

      const filtered = applyFilters(allDiaries, selectedFilter, keyword);
      setFilteredDiaries(filtered);
    },
    [allDiaries, selectedFilter, applyFilters]
  );

  return {
    filteredDiaries,
    filterOptions,
    selectedFilter,
    handleFilterChange,
    handleSearch,
  };
};
