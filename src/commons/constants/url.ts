/**
 * URL Constants
 * URL 경로와 관련된 모든 상수와 메타데이터를 정의합니다.
 * 다이나믹 라우팅을 지원하며, 각 페이지의 레이아웃 설정과 접근 권한을 관리합니다.
 */

// ===== URL 경로 상수 =====

/** 인증 관련 URL */
export const AUTH_LOGIN = "/auth/login" as const;
export const AUTH_SIGNUP = "/auth/signup" as const;

/** 일기 관련 URL */
export const DIARIES = "/diaries" as const;
export const DIARY_DETAIL_BASE = "/diaries" as const;

/** 사진 관련 URL */
export const PICTURES = "/pictures" as const;

// ===== 접근 권한 Enum =====

export enum AccessLevel {
  /** 누구나 접근 가능 */
  Public = "PUBLIC",
  /** 회원 전용 */
  MemberOnly = "MEMBER_ONLY",
}

// ===== Layout 설정 타입 =====

/** Header 설정 */
export interface HeaderConfig {
  /** Header 노출 여부 */
  show: boolean;
  /** 로고 노출 여부 */
  showLogo: boolean;
  /** 다크모드 전환 토글 노출 여부 */
  showDarkModeToggle: boolean;
}

/** 페이지 레이아웃 설정 */
export interface PageLayout {
  header: HeaderConfig;
  banner: boolean;
  navigation: boolean;
  footer: boolean;
}

// ===== URL 메타데이터 타입 =====

export interface UrlMetadata {
  /** URL 경로 */
  path: string;
  /** 접근 권한 */
  accessLevel: AccessLevel;
  /** 레이아웃 설정 */
  layout: PageLayout;
}

// ===== URL 키 Enum =====

export enum UrlKey {
  AuthLogin = "AUTH_LOGIN",
  AuthSignup = "AUTH_SIGNUP",
  Diaries = "DIARIES",
  DiaryDetail = "DIARY_DETAIL",
  Pictures = "PICTURES",
}

// ===== URL 메타데이터 맵 =====

export const urlMetadata: Record<UrlKey, UrlMetadata> = {
  [UrlKey.AuthLogin]: {
    path: AUTH_LOGIN,
    accessLevel: AccessLevel.Public,
    layout: {
      header: {
        show: false,
        showLogo: false,
        showDarkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: false,
    },
  },
  [UrlKey.AuthSignup]: {
    path: AUTH_SIGNUP,
    accessLevel: AccessLevel.Public,
    layout: {
      header: {
        show: false,
        showLogo: false,
        showDarkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: false,
    },
  },
  [UrlKey.Diaries]: {
    path: DIARIES,
    accessLevel: AccessLevel.Public,
    layout: {
      header: {
        show: true,
        showLogo: true,
        showDarkModeToggle: false,
      },
      banner: true,
      navigation: true,
      footer: true,
    },
  },
  [UrlKey.DiaryDetail]: {
    path: DIARY_DETAIL_BASE, // 다이나믹 라우팅은 getDiaryDetailUrl 함수 사용
    accessLevel: AccessLevel.MemberOnly,
    layout: {
      header: {
        show: true,
        showLogo: true,
        showDarkModeToggle: false,
      },
      banner: false,
      navigation: false,
      footer: true,
    },
  },
  [UrlKey.Pictures]: {
    path: PICTURES,
    accessLevel: AccessLevel.Public,
    layout: {
      header: {
        show: true,
        showLogo: true,
        showDarkModeToggle: false,
      },
      banner: true,
      navigation: true,
      footer: true,
    },
  },
};

// ===== 다이나믹 라우팅 함수 =====

/**
 * 일기 상세 페이지 URL을 생성합니다.
 * @param id - 일기 ID
 * @returns 일기 상세 페이지 URL
 */
export const getDiaryDetailUrl = (id: string | number): string => {
  return `${DIARY_DETAIL_BASE}/${id}`;
};

// ===== Helper 함수들 =====

/**
 * URL 키에 해당하는 경로를 반환합니다.
 * @param urlKey - URL 키
 * @returns URL 경로
 */
export const getUrlPath = (urlKey: UrlKey): string => {
  return urlMetadata[urlKey].path;
};

/**
 * URL 키에 해당하는 접근 권한을 반환합니다.
 * @param urlKey - URL 키
 * @returns 접근 권한
 */
export const getAccessLevel = (urlKey: UrlKey): AccessLevel => {
  return urlMetadata[urlKey].accessLevel;
};

/**
 * URL 키에 해당하는 레이아웃 설정을 반환합니다.
 * @param urlKey - URL 키
 * @returns 레이아웃 설정
 */
export const getPageLayout = (urlKey: UrlKey): PageLayout => {
  return urlMetadata[urlKey].layout;
};

/**
 * 현재 경로가 회원 전용 페이지인지 확인합니다.
 * @param urlKey - URL 키
 * @returns 회원 전용 여부
 */
export const isMemberOnlyPage = (urlKey: UrlKey): boolean => {
  return urlMetadata[urlKey].accessLevel === AccessLevel.MemberOnly;
};

/**
 * 현재 경로가 public 페이지인지 확인합니다.
 * @param urlKey - URL 키
 * @returns public 페이지 여부
 */
export const isPublicPage = (urlKey: UrlKey): boolean => {
  return urlMetadata[urlKey].accessLevel === AccessLevel.Public;
};

/**
 * 경로 문자열로부터 해당하는 UrlKey를 찾습니다.
 * @param pathname - 경로 문자열
 * @returns 해당하는 UrlKey 또는 undefined
 */
export const getUrlKeyByPathname = (pathname: string): UrlKey | undefined => {
  // 다이나믹 라우팅 체크 (/diaries/[id] 형식)
  if (pathname.startsWith(`${DIARY_DETAIL_BASE}/`) && pathname !== DIARIES) {
    return UrlKey.DiaryDetail;
  }

  // 정확한 경로 매칭
  const entry = Object.entries(urlMetadata).find(
    ([, metadata]) => metadata.path === pathname
  );

  return entry ? (entry[0] as UrlKey) : undefined;
};

// ===== 모든 URL 키 배열 =====

export const allUrlKeys: UrlKey[] = [
  UrlKey.AuthLogin,
  UrlKey.AuthSignup,
  UrlKey.Diaries,
  UrlKey.DiaryDetail,
  UrlKey.Pictures,
];
