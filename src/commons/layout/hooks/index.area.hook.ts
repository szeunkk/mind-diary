"use client";

import { usePathname } from "next/navigation";
import {
  getUrlKeyByPathname,
  getPageLayout,
  type PageLayout,
} from "@/commons/constants/url";

/**
 * Layout Area 노출 여부 관리 훅
 * 현재 경로에 따라 레이아웃의 각 영역(header, banner, navigation, footer) 노출 여부를 반환합니다.
 * url.ts에 정의된 페이지별 레이아웃 설정을 기반으로 동작합니다.
 */
export const useArea = () => {
  const pathname = usePathname();

  /**
   * 현재 경로에 해당하는 UrlKey를 찾습니다.
   */
  const urlKey = getUrlKeyByPathname(pathname);

  /**
   * UrlKey가 없는 경우 사용할 기본 레이아웃 설정
   * 모든 영역을 노출하는 것이 기본값입니다.
   */
  const defaultLayout: PageLayout = {
    header: {
      show: true,
      showLogo: true,
      showDarkModeToggle: false,
    },
    banner: true,
    navigation: true,
    footer: true,
  };

  /**
   * 현재 경로에 해당하는 레이아웃 설정
   * UrlKey가 있으면 해당 설정, 없으면 기본 레이아웃 사용
   */
  const layout = urlKey ? getPageLayout(urlKey) : defaultLayout;

  // 디버깅용 로그 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    console.log("[Layout Area] pathname:", pathname);
    console.log("[Layout Area] urlKey:", urlKey);
    console.log("[Layout Area] layout:", layout);
  }

  return {
    // header 영역
    showHeader: layout.header.show,
    showHeaderLogo: layout.header.showLogo,
    showHeaderDarkModeToggle: layout.header.showDarkModeToggle,

    // banner 영역
    showBanner: layout.banner,

    // navigation 영역
    showNavigation: layout.navigation,

    // footer 영역
    showFooter: layout.footer,
  };
};
