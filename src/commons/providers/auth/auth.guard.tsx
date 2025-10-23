/**
 * Auth Guard Component
 * 페이지 접근 권한을 검증하는 Guard 컴포넌트
 * - AccessLevel.MemberOnly 페이지는 로그인 필수
 * - 테스트 환경(NEXT_PUBLIC_TEST_ENV=test)에서는 모든 페이지 접근 허용
 * - 권한 없는 경우 "로그인해주세요" 모달 노출
 */

"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth.provider";
import { useModal } from "../modal/modal.provider";
import Modal from "@/commons/components/modal";
import {
  getUrlKeyByPathname,
  isMemberOnlyPage,
  AUTH_LOGIN,
} from "@/commons/constants/url";

export interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { openModal, closeAllModals } = useModal();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const hasShownModal = useRef(false);

  useEffect(() => {
    // 페이지 변경 시 모달 표시 상태 리셋
    hasShownModal.current = false;

    // AuthProvider가 초기화될 때까지 대기
    const checkAuthorization = () => {
      const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === "test";

      // 테스트 환경에서는 모든 페이지 접근 허용
      if (isTestEnv) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // 현재 경로의 UrlKey 찾기
      const urlKey = getUrlKeyByPathname(pathname);

      // urlKey가 없으면 접근 허용 (예: 정의되지 않은 경로)
      if (!urlKey) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // 회원 전용 페이지인지 확인
      const requiresAuth = isMemberOnlyPage(urlKey);

      // 회원 전용 페이지가 아니면 접근 허용
      if (!requiresAuth) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // 회원 전용 페이지인데 로그인하지 않은 경우
      if (!isLoggedIn) {
        setIsAuthorized(false);
        setIsChecking(false);

        // 모달을 한 번만 표시
        if (!hasShownModal.current) {
          hasShownModal.current = true;

          openModal(
            <Modal
              variant="info"
              actions="single"
              title="로그인해주세요"
              description="이 페이지는 로그인이 필요합니다."
              confirmText="확인"
              onConfirm={() => {
                closeAllModals();
                router.push(AUTH_LOGIN);
              }}
            />
          );
        }
        return;
      }

      // 로그인된 경우 접근 허용
      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAuthorization();
    // openModal, closeAllModals, router는 stable하지 않을 수 있으나
    // 여기서는 pathname 또는 로그인 상태 변화시에만 권한 체크를 재실행하면 충분하다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isLoggedIn]);

  // 권한 체크 중이거나 권한이 없는 경우 빈 화면 표시
  if (isChecking || !isAuthorized) {
    return (
      <div style={{ width: "100%", height: "100vh", pointerEvents: "none" }} />
    );
  }

  // 권한이 있는 경우 children 표시
  return <>{children}</>;
}
