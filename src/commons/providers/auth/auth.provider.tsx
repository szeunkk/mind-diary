/**
 * Auth Provider
 * 인증 관련 상태 및 기능을 제공하는 Context Provider
 * - 로그인/로그아웃 기능
 * - 로그인 상태 검증 (localStorage의 accessToken 유무 기반)
 * - 로그인 유저 정보 조회 (localStorage의 user 정보)
 * - 모든 페이지에서 실시간 로그인 상태 감지
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { AUTH_LOGIN } from "@/commons/constants/url";

export interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: unknown;
}

export interface AuthContextType {
  /** 로그인 페이지로 이동 */
  login: () => void;
  /** 로그아웃 (accessToken, user 제거 후 로그인 페이지로 이동) */
  logout: () => void;
  /** 로그인 여부 (accessToken 유무로 판단) */
  isLoggedIn: boolean;
  /** 로그인한 유저 정보 (localStorage의 user) */
  user: User | null;
}

export interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // localStorage에서 인증 상태 확인
  const checkAuthStatus = useCallback(() => {
    if (typeof window === "undefined") return;

    const accessToken = localStorage.getItem("accessToken");
    const userJson = localStorage.getItem("user");

    setIsLoggedIn(!!accessToken);

    if (userJson) {
      try {
        const parsedUser = JSON.parse(userJson);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    setIsMounted(true);
    checkAuthStatus();
  }, [checkAuthStatus]);

  // localStorage 변경 감지 (다른 탭/창에서의 변경사항 포함)
  useEffect(() => {
    if (!isMounted) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" || e.key === "user" || e.key === null) {
        checkAuthStatus();
      }
    };

    // storage 이벤트로 다른 탭/창의 변경사항 감지
    window.addEventListener("storage", handleStorageChange);

    // 주기적으로 상태 확인 (같은 탭에서의 변경사항 감지)
    const intervalId = setInterval(checkAuthStatus, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [isMounted, checkAuthStatus]);

  // 로그인 페이지로 이동
  const login = useCallback(() => {
    router.push(AUTH_LOGIN);
  }, [router]);

  // 로그아웃
  const logout = useCallback(() => {
    if (typeof window === "undefined") return;

    // localStorage에서 accessToken과 user 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    // 상태 업데이트
    setIsLoggedIn(false);
    setUser(null);

    // 로그인 페이지로 이동
    router.push(AUTH_LOGIN);
  }, [router]);

  const value: AuthContextType = {
    login,
    logout,
    isLoggedIn,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
