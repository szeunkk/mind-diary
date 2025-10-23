import { test, expect } from "@playwright/test";

/**
 * Auth Guard Hook - 액션 권한 검증 테스트
 *
 * 테스트 범위:
 * 1. 비로그인 유저의 회원 전용 액션 차단
 * 2. 로그인하시겠습니까 모달 표시 (dual actions)
 * 3. 로그인하러가기 버튼 클릭 시 로그인 페이지 이동
 * 4. 취소 버튼 클릭 시 모달만 닫기
 * 5. 로그인 유저의 액션 정상 실행
 *
 * 주의: useAuthGuard Hook은 실제 컴포넌트에서 사용되어야 테스트 가능
 * 이 테스트는 /diaries 페이지의 "일기쓰기" 버튼을 예시로 작성
 */

test.describe("Auth Guard Hook - 액션 GUARD (비로그인 유저)", () => {
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

    // /diaries 페이지로 이동
    await page.goto("/diaries");
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();
  });

  test("비로그인 유저가 회원 전용 액션(일기쓰기) 시도 시 로그인하시겠습니까 모달 표시", async ({
    page,
  }) => {
    // 일기쓰기 버튼 클릭 (회원 전용 액션)
    const diaryNewButton = page.locator(
      '[data-testid="diary-new-open-button"]'
    );
    await expect(diaryNewButton).toBeVisible();
    await diaryNewButton.click();

    // 로그인하시겠습니까 모달 표시 확인
    const confirmButton = page.locator('[data-testid="modal-confirm-button"]');
    await expect(confirmButton).toBeVisible({ timeout: 3000 });

    // 모달 내용 확인 (info variant, dual actions)
    const modalTitle = page.getByText("로그인 하시겠습니까?");
    await expect(modalTitle).toBeVisible();

    const modalDescription = page.getByText(
      "이 기능을 사용하려면 로그인이 필요합니다."
    );
    await expect(modalDescription).toBeVisible();

    // 두 개의 버튼이 있는지 확인 (dual actions)
    await expect(confirmButton).toHaveText("로그인하기");

    const cancelButton = page.locator('[data-testid="modal-cancel-button"]');
    await expect(cancelButton).toBeVisible();
    await expect(cancelButton).toHaveText("취소");
  });

  test("로그인하시겠습니까 모달에서 로그인하러가기 클릭 시 로그인 페이지로 이동", async ({
    page,
  }) => {
    // 일기쓰기 버튼 클릭
    const diaryNewButton = page.locator(
      '[data-testid="diary-new-open-button"]'
    );
    await diaryNewButton.click();

    // 모달 표시 대기
    const confirmButton = page.locator('[data-testid="modal-confirm-button"]');
    await expect(confirmButton).toBeVisible({ timeout: 3000 });

    // 로그인하러가기 버튼 클릭
    await confirmButton.click();

    // 로그인 페이지로 이동 확인
    await expect(page).toHaveURL("/auth/login");
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });

  test("로그인하시겠습니까 모달에서 취소 클릭 시 모달만 닫히고 페이지 유지", async ({
    page,
  }) => {
    // 일기쓰기 버튼 클릭
    const diaryNewButton = page.locator(
      '[data-testid="diary-new-open-button"]'
    );
    await diaryNewButton.click();

    // 모달 표시 대기
    const cancelButton = page.locator('[data-testid="modal-cancel-button"]');
    await expect(cancelButton).toBeVisible({ timeout: 3000 });

    // 취소 버튼 클릭
    await cancelButton.click();

    // 모달이 닫혔는지 확인
    await expect(cancelButton).not.toBeVisible();

    // 현재 페이지 유지 확인
    await expect(page).toHaveURL("/diaries");
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();
  });

  test("모달은 한 번만 표시되고 같은 액션 시도에서 다시 나타나지 않음", async ({
    page,
  }) => {
    // 일기쓰기 버튼 클릭
    const diaryNewButton = page.locator(
      '[data-testid="diary-new-open-button"]'
    );
    await diaryNewButton.click();

    // 첫 번째 모달 표시 확인
    const confirmButton = page
      .locator('[data-testid="modal-confirm-button"]')
      .first();
    await expect(confirmButton).toBeVisible({ timeout: 3000 });

    // 모달 닫기 (취소 버튼 클릭)
    const cancelButton = page
      .locator('[data-testid="modal-cancel-button"]')
      .first();
    await cancelButton.click();

    // 잠시 대기
    await page.waitForTimeout(500);

    // 같은 액션을 다시 시도해도 모달이 나타나지 않아야 함
    // (hasShownModal.current = true 상태 유지)
    await diaryNewButton.click();
    await page.waitForTimeout(500);

    // 권한 모달이 다시 표시되지 않아야 함
    await expect(confirmButton).not.toBeVisible();

    // 일기쓰기 모달도 표시되지 않아야 함 (여전히 비로그인 상태)
    const diaryNewModal = page.locator('[data-testid="diary-new-modal"]');
    await expect(diaryNewModal).not.toBeVisible();
  });
});

test.describe("Auth Guard Hook - 액션 GUARD (로그인 유저)", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 수행
    await page.goto("/auth/login");

    const emailInput = page.locator('[data-testid="login-email-input"]');
    const passwordInput = page.locator('[data-testid="login-password-input"]');
    const loginSubmitButton = page.locator(
      '[data-testid="login-submit-button"]'
    );

    await emailInput.fill("a@c.com");
    await passwordInput.fill("1234qwer");
    await loginSubmitButton.click();

    // 로그인 성공 모달 확인 클릭
    const modalConfirmButton = page
      .locator('[data-testid="modal-confirm-button"]')
      .first();
    await expect(modalConfirmButton).toBeVisible();
    await modalConfirmButton.click();

    // /diaries 페이지로 이동 확인
    await expect(page).toHaveURL("/diaries");
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();

    // 모달이 완전히 닫힐 때까지 대기
    await page.waitForTimeout(500);
    await expect(modalConfirmButton).not.toBeVisible();
  });

  test("로그인 유저는 회원 전용 액션(일기쓰기) 정상 실행 가능", async ({
    page,
  }) => {
    // 일기쓰기 버튼 클릭
    const diaryNewButton = page.locator(
      '[data-testid="diary-new-open-button"]'
    );
    await expect(diaryNewButton).toBeVisible();
    await diaryNewButton.click();

    // 일기쓰기 모달이 열려야 함 (권한 모달이 아님)
    const diaryNewModal = page.locator('[data-testid="diary-new-modal"]');
    await expect(diaryNewModal).toBeVisible({ timeout: 3000 });

    // 로그인 하시겠습니까? 모달이 표시되지 않아야 함
    const authModalTitle = page.getByText("로그인 하시겠습니까?");
    await expect(authModalTitle).not.toBeVisible();
  });

  test("로그인 유저는 여러 회원 전용 액션을 연속 실행 가능", async ({
    page,
  }) => {
    // 첫 번째 액션
    const diaryNewButton = page.locator(
      '[data-testid="diary-new-open-button"]'
    );
    await diaryNewButton.click();

    const diaryNewModal = page.locator('[data-testid="diary-new-modal"]');
    await expect(diaryNewModal).toBeVisible({ timeout: 3000 });

    // 모달 닫기 (닫기 버튼 클릭)
    const closeButton = page.locator('[data-testid="diary-new-close-button"]');
    await closeButton.click();

    // 등록취소 모달이 나타나면 등록 취소 버튼 클릭
    const cancelSubmitButton = page.locator('text="등록 취소"');
    const isVisible = await cancelSubmitButton
      .isVisible({ timeout: 1000 })
      .catch(() => false);
    if (isVisible) {
      await cancelSubmitButton.click();
    }

    await page.waitForTimeout(500);
    await expect(diaryNewModal).not.toBeVisible();

    // 두 번째 액션 (같은 액션 재시도)
    await diaryNewButton.click();
    await expect(diaryNewModal).toBeVisible({ timeout: 3000 });

    // 권한 모달이 표시되지 않아야 함
    const authModalTitle = page.getByText("로그인 하시겠습니까?");
    await expect(authModalTitle).not.toBeVisible();
  });
});

test.describe("Auth Guard Hook - 테스트 환경 변수 (window.__TEST_BYPASS__)", () => {
  test("window.__TEST_BYPASS__ = false 설정 시 비로그인 검사 수행", async ({
    page,
  }) => {
    // .env.local에 NEXT_PUBLIC_TEST_ENV=test가 설정되어 있다고 가정
    // (실제로는 환경에 따라 달라질 수 있음)

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

    await page.goto("/diaries");

    // 일기쓰기 버튼 클릭
    const diaryNewButton = page.locator(
      '[data-testid="diary-new-open-button"]'
    );
    await diaryNewButton.click();

    // window.__TEST_BYPASS__ = false이므로 모달이 표시되어야 함
    const confirmButton = page.locator('[data-testid="modal-confirm-button"]');
    await expect(confirmButton).toBeVisible({ timeout: 3000 });

    const modalTitle = page.getByText("로그인 하시겠습니까?");
    await expect(modalTitle).toBeVisible();
  });
});

test.describe("Auth Guard Hook - 통합 시나리오", () => {
  test("비로그인 → 모달 → 로그인 → 액션 성공 플로우", async ({ page }) => {
    // Step 1: 비로그인 상태로 일기쓰기 시도
    // 비회원 가드 테스트 활성화 (모든 페이지 로드 시 적용)
    await page.addInitScript(() => {
      // @ts-expect-error - window.__TEST_BYPASS__는 테스트 전용 전역 변수
      window.__TEST_BYPASS__ = false;
    });

    await page.goto("/diaries");
    await page.evaluate(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    });

    await page.goto("/diaries");

    const diaryNewButton = page.locator(
      '[data-testid="diary-new-open-button"]'
    );
    await diaryNewButton.click();

    // Step 2: 모달 표시 확인 및 로그인하기 클릭
    const confirmButton = page.locator('[data-testid="modal-confirm-button"]');
    await expect(confirmButton).toBeVisible({ timeout: 3000 });
    await confirmButton.click();

    // Step 3: 로그인 수행
    await expect(page).toHaveURL("/auth/login", { timeout: 5000 });

    const emailInput = page.locator('[data-testid="login-email-input"]');
    const passwordInput = page.locator('[data-testid="login-password-input"]');
    const loginSubmitButton = page.locator(
      '[data-testid="login-submit-button"]'
    );

    await emailInput.fill("a@c.com");
    await passwordInput.fill("1234qwer");
    await loginSubmitButton.click();

    // 로그인 성공 모달 확인
    const loginModalButton = page.locator(
      '[data-testid="modal-confirm-button"]'
    );
    await expect(loginModalButton).toBeVisible();
    await loginModalButton.click();

    // Step 4: 다시 일기쓰기 시도 (이제 로그인되었으므로 TEST_BYPASS 활성화)
    await page.addInitScript(() => {
      // @ts-expect-error - 로그인 후에는 TEST_BYPASS를 true로 설정
      window.__TEST_BYPASS__ = true;
    });

    await expect(page).toHaveURL("/diaries");
    await page.goto("/diaries"); // 페이지 새로고침하여 TEST_BYPASS 적용

    const diaryNewButtonAfterLogin = page.locator(
      '[data-testid="diary-new-open-button"]'
    );
    await diaryNewButtonAfterLogin.click();

    // Step 5: 이번에는 일기쓰기 모달이 정상 표시되어야 함
    const diaryNewModal = page.locator('[data-testid="diary-new-modal"]');
    await expect(diaryNewModal).toBeVisible({ timeout: 3000 });

    // 권한 모달이 아님을 확인
    const authModalTitle = page.getByText("로그인 하시겠습니까?");
    await expect(authModalTitle).not.toBeVisible();
  });
});
