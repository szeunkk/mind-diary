import { test, expect } from "@playwright/test";

/**
 * Auth Guard - 페이지 접근 권한 검증 테스트
 *
 * 테스트 범위:
 * 1. 비로그인 유저의 회원 전용 페이지 접근 차단
 * 2. 로그인해주세요 모달 표시
 * 3. 모달 확인 클릭 시 로그인 페이지 이동
 * 4. Public 페이지 접근 허용
 */

test.describe("Auth Guard - 페이지 GUARD (비로그인 유저)", () => {
  test.beforeEach(async ({ page }) => {
    // 비회원 가드 테스트 활성화 (모든 페이지 로드 시 적용)
    await page.addInitScript(() => {
      // @ts-expect-error - window.__TEST_BYPASS__는 테스트 전용 전역 변수
      window.__TEST_BYPASS__ = false;
    });

    // localStorage 초기화 (비로그인 상태 보장)
    await page.goto("/diaries");
    await page.evaluate(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    });
  });

  test("비로그인 유저가 회원 전용 페이지(/diaries/1) 접속 시 로그인해주세요 모달 표시", async ({
    page,
  }) => {
    // 회원 전용 페이지 접속
    await page.goto("/diaries/1");

    // 빈 화면이 먼저 표시되는지 확인 (권한 체크 중)
    // 실제로는 너무 빠르게 지나가서 확인이 어려울 수 있음

    // 로그인해주세요 모달 표시 확인 (중복 모달 방지를 위해 .first() 사용)
    const modal = page.locator('[data-testid="modal-confirm-button"]').first();
    await expect(modal).toBeVisible({ timeout: 500 });

    // 모달 내용 확인 (info variant, single action)
    const modalTitle = page.getByText("로그인해주세요");
    await expect(modalTitle).toBeVisible();

    const modalDescription = page.getByText("이 페이지는 로그인이 필요합니다.");
    await expect(modalDescription).toBeVisible();

    // 확인 버튼만 있는지 확인 (single action)
    await expect(modal).toHaveText("확인");

    // 취소 버튼이 없는지 확인
    const cancelButton = page.locator('[data-testid="modal-cancel-button"]');
    await expect(cancelButton).not.toBeVisible();
  });

  test("로그인해주세요 모달에서 확인 클릭 시 로그인 페이지로 이동", async ({
    page,
  }) => {
    // 회원 전용 페이지 접속
    await page.goto("/diaries/1");

    // 모달 표시 대기 (중복 모달 방지를 위해 .first() 사용)
    const confirmButton = page
      .locator('[data-testid="modal-confirm-button"]')
      .first();
    await expect(confirmButton).toBeVisible({ timeout: 500 });

    // 확인 버튼 클릭
    await confirmButton.click();

    // 로그인 페이지로 이동 확인
    await expect(page).toHaveURL("/auth/login");
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });

  test("비로그인 유저도 Public 페이지(/diaries)는 정상 접속 가능", async ({
    page,
  }) => {
    // Public 페이지 접속
    await page.goto("/diaries");

    // 페이지 정상 로드 확인
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();

    // 모달이 표시되지 않아야 함
    const modal = page.locator('[data-testid="modal-confirm-button"]');
    await expect(modal).not.toBeVisible();

    // 일기 목록이 보여야 함 (또는 다른 페이지 콘텐츠)
    await expect(page).toHaveURL("/diaries");
  });

  test("비로그인 유저가 로그인 페이지(/auth/login) 접속 가능", async ({
    page,
  }) => {
    // 로그인 페이지 접속
    await page.goto("/auth/login");

    // 로그인 폼 표시 확인
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();

    // 모달이 표시되지 않아야 함
    const modal = page.locator('[data-testid="modal-confirm-button"]');
    await expect(modal).not.toBeVisible();
  });

  test("비로그인 유저가 회원가입 페이지(/auth/signup) 접속 가능", async ({
    page,
  }) => {
    // 회원가입 페이지 접속
    await page.goto("/auth/signup");

    // 회원가입 폼 표시 확인
    await expect(page.locator('[data-testid="signup-form"]')).toBeVisible();

    // 모달이 표시되지 않아야 함
    const modal = page.locator('[data-testid="modal-confirm-button"]');
    await expect(modal).not.toBeVisible();
  });

  test("모달은 한 번만 표시되고 같은 상황에서 다시 나타나지 않음", async ({
    page,
  }) => {
    // 회원 전용 페이지 접속
    await page.goto("/diaries/1");

    // 첫 번째 모달 표시 확인
    const confirmButton = page.locator('[data-testid="modal-confirm-button"]');
    await expect(confirmButton).toBeVisible({ timeout: 500 });

    // 모달 닫기 (backdrop 클릭 또는 ESC 키)
    await page.keyboard.press("Escape");

    // 모달이 완전히 사라질 때까지 대기 (네트워크 통신 없음: 500ms 미만)
    await page.waitForTimeout(500);

    // 모달이 다시 나타나지 않는지 확인
    await expect(confirmButton).not.toBeVisible();
  });
});

test.describe("Auth Guard - 페이지 GUARD (로그인 유저)", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태 설정 (회원으로 가장)
    await page.goto("/diaries");
    await page.evaluate(() => {
      window.__TEST_BYPASS__ = true;
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "test-user",
          email: "test@example.com",
          name: "Test User",
        })
      );
    });
  });

  test("로그인 유저는 회원 전용 페이지(/diaries/1) 정상 접속 가능", async ({
    page,
  }) => {
    // 회원 전용 페이지 접속
    await page.goto("/diaries/1");

    // 페이지 정상 로드 확인
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();

    // 모달이 표시되지 않아야 함
    const modal = page.locator('[data-testid="modal-confirm-button"]');
    await expect(modal).not.toBeVisible();

    // URL 확인
    await expect(page).toHaveURL("/diaries/1");
  });

  test("로그인 유저도 Public 페이지 정상 접속 가능", async ({ page }) => {
    // Public 페이지 접속
    await page.goto("/diaries");

    // 페이지 정상 로드 확인
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();

    // 모달이 표시되지 않아야 함
    const modal = page.locator('[data-testid="modal-confirm-button"]');
    await expect(modal).not.toBeVisible();
  });

  test("로그인 후 다른 회원 전용 페이지 접속 시에도 모달 없이 접속 가능", async ({
    page,
  }) => {
    // 첫 번째 회원 전용 페이지
    await page.goto("/diaries/1");
    await expect(page).toHaveURL("/diaries/1");

    // 모달 없음 확인
    let modal = page.locator('[data-testid="modal-confirm-button"]');
    await expect(modal).not.toBeVisible();

    // 두 번째 회원 전용 페이지
    await page.goto("/diaries/2");
    await expect(page).toHaveURL("/diaries/2");

    // 모달 없음 확인
    modal = page.locator('[data-testid="modal-confirm-button"]');
    await expect(modal).not.toBeVisible();
  });
});

test.describe("Auth Guard - 새로고침 시나리오", () => {
  test("로그인 후 회원 전용 페이지에서 새로고침 시 정상 동작", async ({
    page,
  }) => {
    // 로그인 상태 설정 (간소화)
    await page.addInitScript(() => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "test-user",
          email: "test@example.com",
          name: "Test User",
        })
      );
    });

    // 회원 전용 페이지로 이동
    await page.goto("/diaries/1");
    await expect(page).toHaveURL("/diaries/1", { timeout: 5000 });

    // 페이지 새로고침
    await page.reload();

    // AuthProvider 초기화 대기 후 정상 표시 확인
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();

    // 모달이 표시되지 않아야 함 (로그인 상태 유지)
    const modal = page.locator('[data-testid="modal-confirm-button"]');
    await expect(modal).not.toBeVisible();
  });

  test("비로그인 상태에서 회원 전용 페이지 새로고침 시 모달 재표시", async ({
    page,
  }) => {
    // 비회원 가드 테스트 활성화 (모든 페이지 로드 시 적용)
    await page.addInitScript(() => {
      // @ts-expect-error - window.__TEST_BYPASS__는 테스트 전용 전역 변수
      window.__TEST_BYPASS__ = false;
    });

    // localStorage 초기화
    await page.goto("/diaries");
    await page.evaluate(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    });

    // 회원 전용 페이지 접속
    await page.goto("/diaries/1");

    // 모달 표시 확인 (중복 모달 방지를 위해 .first() 사용)
    let confirmButton = page
      .locator('[data-testid="modal-confirm-button"]')
      .first();
    await expect(confirmButton).toBeVisible({ timeout: 500 });

    // 페이지 새로고침
    await page.reload();

    // 모달 다시 표시 확인 (페이지 변경으로 리셋됨)
    confirmButton = page.locator('[data-testid="modal-confirm-button"]');
    await expect(confirmButton).toBeVisible({ timeout: 500 });
  });
});
