/**
 * Typography Constants
 * 피그마 파운데이션 기반 타이포그래피 토큰 시스템
 * 한글(Pretendard), 영문 폰트를 구분하여 사용합니다.
 * 모바일과 데스크톱에서 각각 다른 타이포그래피를 적용할 수 있습니다.
 * CSS 변수와 연동되어 사용됩니다.
 */

// Helper function to get CSS variable
const cssVar = (name: string): string => `var(--typo-${name})`;

// Typography Style Interface
export interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
}

// Web Headline Types (Desktop)
export interface WebHeadline {
  webHeadline01: string;
  webHeadline02: string;
  webHeadline03: string;
}

export const webHeadline: WebHeadline = {
  webHeadline01: cssVar("web-headline-01"),
  webHeadline02: cssVar("web-headline-02"),
  webHeadline03: cssVar("web-headline-03"),
};

// Headline Types (Mobile & Desktop)
export interface Headline {
  headline01: string;
  headline02: string;
  headline03: string;
}

export const headline: Headline = {
  headline01: cssVar("headline-01"),
  headline02: cssVar("headline-02"),
  headline03: cssVar("headline-03"),
};

// Title Types
export interface Title {
  title01: string;
  title02: string;
  title03: string;
  subTitle01: string;
  subTitle02: string;
}

export const title: Title = {
  title01: cssVar("title-01"),
  title02: cssVar("title-02"),
  title03: cssVar("title-03"),
  subTitle01: cssVar("sub-title-01"),
  subTitle02: cssVar("sub-title-02"),
};

// Body Types
export interface Body {
  body01: string;
  body02M: string;
  body02S: string;
  body03: string;
}

export const body: Body = {
  body01: cssVar("body-01"),
  body02M: cssVar("body-02-m"),
  body02S: cssVar("body-02-s"),
  body03: cssVar("body-03"),
};

// Caption Types
export interface Caption {
  caption01: string;
  caption02M: string;
  caption02S: string;
  caption03: string;
}

export const caption: Caption = {
  caption01: cssVar("caption-01"),
  caption02M: cssVar("caption-02-m"),
  caption02S: cssVar("caption-02-s"),
  caption03: cssVar("caption-03"),
};

// Complete Typography System Interface
export interface TypographySystem {
  webHeadline: WebHeadline;
  headline: Headline;
  title: Title;
  body: Body;
  caption: Caption;
}

// Complete Typography System
export const typography: TypographySystem = {
  webHeadline,
  headline,
  title,
  body,
  caption,
};

// Font Family Constants
export const fontFamily = {
  korean: cssVar("font-family-korean"),
  english: cssVar("font-family-english"),
} as const;

// Font Weight Constants
export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const;

// Default export
export default typography;
