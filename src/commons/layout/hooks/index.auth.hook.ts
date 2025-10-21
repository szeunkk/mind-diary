"use client";

import { useAuth } from "@/commons/providers/auth/auth.provider";

/**
 * useAuthLayout Hook
 *
 * 레이아웃에서 인증 관련 기능을 제공하는 훅입니다.
 * auth.provider의 인증 상태와 기능을 레이아웃 컴포넌트에 연결합니다.
 *
 * 주요 기능:
 * - 로그인/로그아웃 기능 연결
 * - 로그인 상태에 따른 UI 분기
 * - 로그인한 유저 정보 제공
 *
 * @returns 인증 상태 및 핸들러 함수들을 포함한 객체
 */
export const useAuthLayout = () => {
  /**
   * auth.provider에서 제공하는 인증 컨텍스트
   */
  const { isLoggedIn, user, login, logout } = useAuth();

  return {
    /** 로그인 여부 (accessToken 유무로 판단) */
    isLoggedIn,
    /** 로그인한 유저 정보 (localStorage의 user) */
    user,
    /** 로그인 페이지로 이동하는 핸들러 */
    handleLogin: login,
    /** 로그아웃 처리 핸들러 (accessToken, user 제거 후 로그인 페이지로 이동) */
    handleLogout: logout,
  };
};
