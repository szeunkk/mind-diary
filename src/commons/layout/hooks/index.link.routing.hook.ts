import { useRouter, usePathname } from "next/navigation";
import { DIARIES, PICTURES } from "../../constants/url";

/**
 * Layout 링크 라우팅 훅
 * 레이아웃 내 클릭 가능한 요소들의 페이지 이동 기능을 제공하고,
 * 현재 경로에 따른 액티브 상태를 관리합니다.
 */
export const useLinkRouting = () => {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * 헤더 로고 클릭 핸들러
   * 일기목록 페이지로 이동합니다.
   */
  const handleLogoClick = () => {
    router.push(DIARIES);
  };

  /**
   * 네비게이션 일기보관함 클릭 핸들러
   * 일기목록 페이지로 이동합니다.
   */
  const handleDiariesClick = () => {
    router.push(DIARIES);
  };

  /**
   * 네비게이션 사진보관함 클릭 핸들러
   * 사진목록 페이지로 이동합니다.
   */
  const handlePicturesClick = () => {
    router.push(PICTURES);
  };

  /**
   * 일기보관함 탭이 액티브 상태인지 확인
   * 일기 목록 페이지(/diaries) 또는 일기 상세 페이지(/diaries/[id])일 때 true
   */
  const isDiariesActive =
    pathname === DIARIES || pathname.startsWith(`${DIARIES}/`);

  /**
   * 사진보관함 탭이 액티브 상태인지 확인
   * 사진 목록 페이지(/pictures)일 때 true
   */
  const isPicturesActive = pathname === PICTURES;

  // 디버깅용 로그 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    console.log("[Layout Navigation] pathname:", pathname);
    console.log("[Layout Navigation] isDiariesActive:", isDiariesActive);
    console.log("[Layout Navigation] isPicturesActive:", isPicturesActive);
  }

  return {
    handleLogoClick,
    handleDiariesClick,
    handlePicturesClick,
    isDiariesActive,
    isPicturesActive,
  };
};
