"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
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
 * @returns 일기 상세 데이터 또는 null
 */
export const useDiaryBinding = (): DiaryDetailData | null => {
  const params = useParams();

  // useMemo를 사용하여 초기 데이터를 빠르게 가져옴
  const initialData = useMemo(() => {
    return getDiaryFromLocalStorage(params?.id);
  }, [params?.id]);

  const [diaryData, setDiaryData] = useState<DiaryDetailData | null>(
    initialData
  );

  useEffect(() => {
    // params가 변경될 때 데이터 업데이트
    const newData = getDiaryFromLocalStorage(params?.id);
    setDiaryData(newData);
  }, [params?.id]);

  return diaryData;
};
