"use client";

import { useState } from "react";

/**
 * 필터 타입 정의
 */
export type FilterType = "default" | "horizontal" | "vertical";

/**
 * 필터 옵션 타입
 */
export interface FilterOption {
  value: FilterType;
  label: string;
}

/**
 * 필터 옵션 목록
 */
const FILTER_OPTIONS: FilterOption[] = [
  { value: "default", label: "기본" },
  { value: "horizontal", label: "가로형" },
  { value: "vertical", label: "세로형" },
];

/**
 * usePictureFilter Hook
 *
 * 강아지 사진 필터 기능을 제공하는 커스텀 훅입니다.
 * 필터 선택에 따라 CSS를 통해 이미지 사이즈를 동적으로 변경합니다.
 *
 * 기능:
 * 1. 필터 선택 상태 관리 (기본, 가로형, 세로형)
 * 2. 필터 옵션 목록 제공
 * 3. 필터 변경 핸들러 제공
 *
 * 참고:
 * - 이미지 크기는 CSS의 data-filter 속성을 통해 제어됩니다
 * - 기본: 640x640px, 가로형: 640x480px, 세로형: 480x640px
 *
 * @returns {Object} 필터 관련 상태 및 함수
 * @returns {FilterType} selectedFilter - 현재 선택된 필터
 * @returns {FilterOption[]} filterOptions - 필터 옵션 목록
 * @returns {function} handleFilterChange - 필터 변경 핸들러
 */
export const usePictureFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("default");

  /**
   * 필터 변경 핸들러
   * @param value - 선택된 필터 값
   */
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value as FilterType);
  };

  return {
    selectedFilter,
    filterOptions: FILTER_OPTIONS,
    handleFilterChange,
  };
};
