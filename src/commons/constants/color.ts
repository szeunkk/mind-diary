/**
 * Color Constants
 * 피그마 파운데이션 기반 컬러 토큰 시스템
 * 다크모드를 포함한 모든 컬러 토큰을 정의합니다.
 * CSS 변수와 연동되어 사용됩니다.
 */

// Helper function to get CSS variable
const cssVar = (name: string): string => `var(--color-${name})`;

// Blue (Primary) Color Scale
export interface BlueScale {
  5: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
  70: string;
  80: string;
  90: string;
}

export const blue: BlueScale = {
  5: cssVar("blue-05"),
  10: cssVar("blue-10"),
  20: cssVar("blue-20"),
  30: cssVar("blue-30"),
  40: cssVar("blue-40"),
  50: cssVar("blue-50"),
  60: cssVar("blue-60"),
  70: cssVar("blue-70"),
  80: cssVar("blue-80"),
  90: cssVar("blue-90"),
};

// Gray Color Scale
export interface GrayScale {
  white: string;
  5: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
  70: string;
  80: string;
  90: string;
  black: string;
}

export const gray: GrayScale = {
  white: cssVar("gray-white"),
  5: cssVar("gray-05"),
  10: cssVar("gray-10"),
  20: cssVar("gray-20"),
  30: cssVar("gray-30"),
  40: cssVar("gray-40"),
  50: cssVar("gray-50"),
  60: cssVar("gray-60"),
  70: cssVar("gray-70"),
  80: cssVar("gray-80"),
  90: cssVar("gray-90"),
  black: cssVar("gray-black"),
};

// Red (Error) Color Scale
export interface RedScale {
  5: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
}

export const red: RedScale = {
  5: cssVar("red-05"),
  10: cssVar("red-10"),
  20: cssVar("red-20"),
  30: cssVar("red-30"),
  40: cssVar("red-40"),
  50: cssVar("red-50"),
  60: cssVar("red-60"),
};

// Green (Success) Color Scale
export interface GreenScale {
  5: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
}

export const green: GreenScale = {
  5: cssVar("green-05"),
  10: cssVar("green-10"),
  20: cssVar("green-20"),
  30: cssVar("green-30"),
  40: cssVar("green-40"),
  50: cssVar("green-50"),
  60: cssVar("green-60"),
};

// Yellow Color Scale
export interface YellowScale {
  5: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
}

export const yellow: YellowScale = {
  5: cssVar("yellow-05"),
  10: cssVar("yellow-10"),
  20: cssVar("yellow-20"),
  30: cssVar("yellow-30"),
  40: cssVar("yellow-40"),
  50: cssVar("yellow-50"),
  60: cssVar("yellow-60"),
};

// Cool Gray Color Scale
export interface CoolGrayScale {
  1: string;
  5: string;
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
}

export const coolGray: CoolGrayScale = {
  1: cssVar("cool-gray-01"),
  5: cssVar("cool-gray-05"),
  10: cssVar("cool-gray-10"),
  20: cssVar("cool-gray-20"),
  30: cssVar("cool-gray-30"),
  40: cssVar("cool-gray-40"),
  50: cssVar("cool-gray-50"),
  60: cssVar("cool-gray-60"),
};

// Semantic Color Type
export interface SemanticColors {
  primary: string;
  success: string;
  error: string;
  warning: string;
  disabled: string;
  background: string;
  foreground: string;
  surface: string;
  surfaceVariant: string;
  border: string;
  borderFocus: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textInverse: string;
}

export const semantic: SemanticColors = {
  primary: cssVar("primary"),
  success: cssVar("success"),
  error: cssVar("error"),
  warning: cssVar("warning"),
  disabled: cssVar("disabled"),
  background: cssVar("background"),
  foreground: cssVar("foreground"),
  surface: cssVar("surface"),
  surfaceVariant: cssVar("surface-variant"),
  border: cssVar("border"),
  borderFocus: cssVar("border-focus"),
  textPrimary: cssVar("text-primary"),
  textSecondary: cssVar("text-secondary"),
  textDisabled: cssVar("text-disabled"),
  textInverse: cssVar("text-inverse"),
};

// Complete Color System Interface
export interface ColorSystem {
  blue: BlueScale;
  gray: GrayScale;
  red: RedScale;
  green: GreenScale;
  yellow: YellowScale;
  coolGray: CoolGrayScale;
  semantic: SemanticColors;
}

// Complete Color System
export const colors: ColorSystem = {
  blue,
  gray,
  red,
  green,
  yellow,
  coolGray,
  semantic,
};

// Default export
export default colors;
