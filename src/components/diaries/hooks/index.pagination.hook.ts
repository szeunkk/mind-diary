"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { DiaryDisplayData } from "./index.filter.hook";

/**
 * 페이지당 표시할 일기 카드 개수
 * 3행 4열 = 12개
 */
const ITEMS_PER_PAGE = 12;

/**
 * useDiaryPagination Hook
 *
 * 일기 목록의 페이지네이션 기능을 제공합니다.
 * - 한 페이지에 12개의 일기 카드 표시 (3행 4열)
 * - 페이지 변경 시 해당 페이지의 일기만 반환
 * - 필터링/검색 결과에 따라 페이지 수 동적 계산
 *
 * @param filteredDiaries - 필터링된 일기 목록
 * @returns {Object} 페이지네이션 관련 상태 및 함수
 * @returns {DiaryDisplayData[]} paginatedDiaries - 현재 페이지의 일기 목록
 * @returns {number} currentPage - 현재 페이지 번호
 * @returns {number} totalPages - 전체 페이지 수
 * @returns {function} handlePageChange - 페이지 변경 함수
 */
export const useDiaryPagination = (filteredDiaries: DiaryDisplayData[]) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 전체 페이지 수 계산
  const totalPages = useMemo(() => {
    if (filteredDiaries.length === 0) {
      return 1;
    }
    return Math.ceil(filteredDiaries.length / ITEMS_PER_PAGE);
  }, [filteredDiaries.length]);

  // 필터링된 일기 목록이 변경되면 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredDiaries.length]);

  // 현재 페이지의 일기 목록
  const paginatedDiaries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredDiaries.slice(startIndex, endIndex);
  }, [filteredDiaries, currentPage]);

  // 페이지 변경 함수
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) {
        return;
      }
      setCurrentPage(page);
    },
    [totalPages]
  );

  return {
    paginatedDiaries,
    currentPage,
    totalPages,
    handlePageChange,
  };
};
