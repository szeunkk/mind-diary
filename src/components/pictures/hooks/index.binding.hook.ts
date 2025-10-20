import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

// API 응답 타입 정의
interface DogApiResponse {
  message: string[];
  status: string;
}

// 강아지 사진 데이터 타입
interface DogPicture {
  id: string;
  src: string;
  alt: string;
}

// API 함수: Dog CEO API에서 강아지 사진들을 가져옴
const fetchDogPictures = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _pageParam: number = 0
): Promise<DogApiResponse> => {
  const response = await fetch("https://dog.ceo/api/breeds/image/random/6");

  if (!response.ok) {
    throw new Error("사진을 불러올 수 없습니다.");
  }

  const data: DogApiResponse = await response.json();

  if (data.status !== "success") {
    throw new Error("사진을 불러올 수 없습니다.");
  }

  return data;
};

// 강아지 사진 무한 스크롤 Hook
export const useDogPictures = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 무한 쿼리 설정
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["dogPictures"],
    queryFn: ({ pageParam }) => fetchDogPictures(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      // 무한 스크롤을 위해 다음 페이지 번호 반환
      return pages.length;
    },
    staleTime: 60 * 1000 * 2, // 2분
    gcTime: 60 * 1000 * 5, // 5분
  });

  // 모든 페이지의 강아지 사진들을 하나의 배열로 변환
  const allPictures: DogPicture[] =
    data?.pages.flatMap((page, pageIndex) =>
      page.message.map((src, index) => ({
        id: `${pageIndex}-${index}`,
        src,
        alt: `강아지 사진 ${pageIndex * 6 + index + 1}`,
      }))
    ) || [];

  // 무한 스크롤 관찰자 설정
  const setLoadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadMoreRef.current) {
        observerRef.current?.unobserve(loadMoreRef.current);
      }

      loadMoreRef.current = node;

      if (!node) return;

      // 기존 관찰자 해제
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // 새로운 관찰자 생성
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          rootMargin: "200px", // 200px 전에 미리 로딩 시작
          threshold: 0.1,
        }
      );

      observerRef.current.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // 컴포넌트 언마운트 시 관찰자 정리
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // 마지막 2개 아이템에서 트리거되는 관찰자 설정
  const setTriggerRef = useCallback(
    (index: number) => {
      const totalPictures = allPictures.length;
      if (totalPictures > 4 && index === totalPictures - 2) {
        // 마지막에서 2번째 아이템에 트리거 설정
        return setLoadMoreRef;
      }
      return undefined;
    },
    [allPictures.length, setLoadMoreRef]
  );

  // 재시도 함수
  const retry = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // 데이터
    pictures: allPictures,

    // 로딩 상태
    isInitialLoading: isLoading, // 첫 로딩 (스플래시 스크린용)
    isLoadingMore: isFetchingNextPage, // 추가 로딩

    // 에러 상태
    isError,
    error: error as Error | null,

    // 무한 스크롤 관련
    hasNextPage,
    setLoadMoreRef,
    setTriggerRef,

    // 유틸리티
    retry,
  };
};

// 스플래시 스크린용 Hook
export const useSplashScreens = (isLoading: boolean) => {
  // 로딩 중일 때 6개의 스플래시 스크린 생성
  const splashScreens = isLoading
    ? Array.from({ length: 6 }, (_, index) => ({
        id: `splash-${index}`,
        index,
      }))
    : [];

  return {
    splashScreens,
    showSplashScreens: isLoading,
  };
};
