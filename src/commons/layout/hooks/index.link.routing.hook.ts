import { useRouter } from 'next/navigation';
import { DIARIES, PICTURES } from '../../constants/url';

/**
 * Layout 링크 라우팅 훅
 * 레이아웃 내 클릭 가능한 요소들의 페이지 이동 기능을 제공합니다.
 */
export const useLinkRouting = () => {
  const router = useRouter();

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

  return {
    handleLogoClick,
    handleDiariesClick,
    handlePicturesClick,
  };
};
