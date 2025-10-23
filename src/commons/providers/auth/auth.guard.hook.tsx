/**
 * Auth Guard Hook
 * 액션 실행 시 권한을 검증하는 Hook
 * - 로그인이 필요한 액션에 대한 권한 검증
 * - 테스트 환경(NEXT_PUBLIC_TEST_ENV=test)에서는 window.__TEST_BYPASS__ 체크
 * - 권한 없는 경우 "로그인하시겠습니까" 모달 노출
 */

"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth.provider";
import { useModal } from "../modal/modal.provider";
import Modal from "@/commons/components/modal";
import { AUTH_LOGIN } from "@/commons/constants/url";

// 테스트 환경에서 로그인 검사를 우회하기 위한 전역 변수 타입 선언
declare global {
  interface Window {
    __TEST_BYPASS__?: boolean;
  }
}

export interface UseAuthGuardReturn {
  /**
   * 회원 전용 액션 실행 전에 로그인 여부를 검증합니다.
   * @returns 로그인 여부 (true: 로그인됨, false: 로그인 안됨)
   */
  checkAuth: () => boolean;
}

/**
 * 액션 실행 시 권한을 검증하는 Hook
 * @returns checkAuth 함수
 */
export function useAuthGuard(): UseAuthGuardReturn {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { openModal, closeAllModals } = useModal();
  const hasShownModal = useRef(false);

  const checkAuth = useCallback(() => {
    // 테스트 환경 체크
    const isTestEnv = process.env.NEXT_PUBLIC_TEST_ENV === "test";

    // 테스트 환경에서는 window.__TEST_BYPASS__ 체크
    // window.__TEST_BYPASS__가 false이면 실제 검사를 수행
    if (isTestEnv) {
      const shouldBypass =
        typeof window !== "undefined" && window.__TEST_BYPASS__ !== false;

      if (shouldBypass) {
        // 테스트 환경에서 로그인 검사를 패스
        return true;
      }
    }

    // 로그인 상태 확인 (localStorage도 직접 체크하여 상태 업데이트 지연 문제 해결)
    const hasAccessToken =
      typeof window !== "undefined" && !!localStorage.getItem("accessToken");

    if (isLoggedIn || hasAccessToken) {
      return true;
    }

    // 로그인하지 않은 경우 - 모달을 한 번만 표시
    if (!hasShownModal.current) {
      hasShownModal.current = true;

      openModal(
        <Modal
          variant="info"
          actions="dual"
          title="로그인 하시겠습니까?"
          description="이 기능을 사용하려면 로그인이 필요합니다."
          confirmText="로그인하기"
          cancelText="취소"
          onConfirm={() => {
            closeAllModals();
            router.push(AUTH_LOGIN);
            // 로그인 페이지로 이동 (로그인 성공 후 hasShownModal은 자동으로 리셋됨)
          }}
          onCancel={() => {
            closeAllModals();
            // 취소 시 hasShownModal은 유지 (같은 상황에서 모달이 다시 나타나지 않도록)
          }}
        />
      );
    }

    return false;
  }, [isLoggedIn, openModal, closeAllModals, router]);

  return { checkAuth };
}
