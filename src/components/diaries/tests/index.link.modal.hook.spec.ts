/**
 * 일기쓰기 모달 권한 분기 기능 테스트
 *
 * TDD 기반으로 일기쓰기 모달의 권한 분기 기능을 테스트합니다.
 * - 비로그인 유저: 로그인 요청 모달 노출
 * - 로그인 유저: 일기쓰기 모달 노출
 */

import { test, expect } from "@playwright/test";

test.describe("일기 목록 페이지 - 일기쓰기 모달 (권한 분기)", () => {
  test.describe("비로그인 유저 시나리오", () => {
    test.beforeEach(async ({ page }) => {
      // 비로그인 상태로 설정
      await page.addInitScript(() => {
        // localStorage 초기화 (이전 테스트의 로그인 정보 제거)
        localStorage.clear();
        // TEST_BYPASS를 false로 설정
        window.__TEST_BYPASS__ = false;
      });

      // /diaries 페이지로 이동
      await page.goto("/diaries");

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diaries-page"]');
    });

    test("일기쓰기 버튼 클릭 시 로그인 요청 모달이 노출된다", async ({
      page,
    }) => {
      // 일기쓰기 버튼 클릭
      await page.click('[data-testid="diary-new-open-button"]');

      // 로그인 요청 모달이 표시되는지 확인
      const modal = page.locator('[data-testid="modal"]');
      await expect(modal).toBeVisible();

      // 모달 제목 확인
      const modalTitle = page.locator('[data-testid="modal-title"]');
      await expect(modalTitle).toHaveText("로그인 하시겠습니까?");

      // 로그인 요청 모달의 설명 확인
      const description = page.locator('[data-testid="modal-description"]');
      await expect(description).toBeVisible();
      await expect(description).toHaveText(
        "이 기능을 사용하려면 로그인이 필요합니다."
      );

      // 확인 버튼 텍스트 확인
      const confirmButton = page.locator(
        '[data-testid="modal-confirm-button"]'
      );
      await expect(confirmButton).toHaveText("로그인하기");

      // 일기쓰기 모달은 노출되지 않아야 함
      const diaryNewModal = page.locator('[data-testid="diary-new-modal"]');
      await expect(diaryNewModal).not.toBeVisible();
    });

    test("로그인 요청 모달에서 '로그인하기' 클릭 시 로그인 페이지로 이동한다", async ({
      page,
    }) => {
      // 일기쓰기 버튼 클릭
      await page.click('[data-testid="diary-new-open-button"]');

      // 로그인 요청 모달이 표시될 때까지 대기
      await page.waitForSelector('[data-testid="modal"]');

      // 확인 버튼 클릭
      await page.click('[data-testid="modal-confirm-button"]');

      // 로그인 페이지로 이동 확인
      await expect(page).toHaveURL("/auth/login");
    });

    test("로그인 요청 모달에서 '취소' 클릭 시 모달이 닫힌다", async ({
      page,
    }) => {
      // 일기쓰기 버튼 클릭
      await page.click('[data-testid="diary-new-open-button"]');

      // 로그인 요청 모달이 표시될 때까지 대기
      await page.waitForSelector('[data-testid="modal"]');

      // 취소 버튼 클릭
      await page.click('[data-testid="modal-cancel-button"]');

      // 모달이 닫혔는지 확인
      const modal = page.locator('[data-testid="modal"]');
      await expect(modal).not.toBeVisible();
    });
  });

  test.describe("로그인 유저 시나리오", () => {
    test.beforeEach(async ({ page }) => {
      // 로그인 상태로 설정 (localStorage에 accessToken 추가)
      await page.addInitScript(() => {
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

      // /diaries 페이지로 이동
      await page.goto("/diaries");

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diaries-page"]');
    });

    test("일기쓰기 버튼 클릭 시 일기쓰기 모달이 노출된다", async ({ page }) => {
      // 일기쓰기 버튼 클릭
      await page.click('[data-testid="diary-new-open-button"]');

      // 일기쓰기 모달이 표시되는지 확인
      const modal = page.locator('[data-testid="diary-new-modal"]');
      await expect(modal).toBeVisible();

      // 모달 제목 확인
      const diaryNewTitle = page.locator('[data-testid="diary-new-title"]');
      await expect(diaryNewTitle).toHaveText("일기 쓰기");

      // 로그인 요청 모달은 노출되지 않아야 함
      // (모달이 열렸다면 제목으로 확인)
      const loginModalTitle = page.locator('[data-testid="modal-title"]');
      await expect(loginModalTitle).not.toBeVisible();
    });
  });
});
