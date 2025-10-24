/**
 * 일기 삭제 기능 테스트
 *
 * TDD 기반으로 일기 삭제 기능을 테스트합니다.
 * - 비로그인 유저: 삭제 아이콘(X) 미노출
 * - 로그인 유저: 삭제 아이콘(X) 노출, 삭제 모달, 삭제 처리
 */

import { test, expect } from "@playwright/test";

test.describe("일기 목록 페이지 - 일기 삭제 (권한 분기)", () => {
  test.describe("비로그인 유저 시나리오", () => {
    test.beforeEach(async ({ page }) => {
      // 비로그인 상태로 설정
      await page.addInitScript(() => {
        // localStorage 초기화
        localStorage.clear();
        // TEST_BYPASS를 false로 설정
        window.__TEST_BYPASS__ = false;

        // 테스트용 일기 데이터 추가
        localStorage.setItem(
          "diaries",
          JSON.stringify([
            {
              id: 1,
              title: "테스트 일기 1",
              content: "테스트 내용 1",
              emotion: "HAPPY",
              date: "2024-01-01",
              createdAt: "2024-01-01T00:00:00.000Z",
            },
            {
              id: 2,
              title: "테스트 일기 2",
              content: "테스트 내용 2",
              emotion: "SAD",
              date: "2024-01-02",
              createdAt: "2024-01-02T00:00:00.000Z",
            },
          ])
        );
      });

      // /diaries 페이지로 이동
      await page.goto("/diaries");

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diaries-page"]');
    });

    test("일기카드 각각의 삭제아이콘(X) 미노출 확인", async ({ page }) => {
      // 일기 카드가 존재하는지 확인
      const diaryCards = page.locator('[data-testid^="diary-card-"]');
      const count = await diaryCards.count();
      expect(count).toBeGreaterThan(0);

      // 모든 삭제 버튼이 숨겨져 있는지 확인
      const deleteButtons = page.locator('[data-testid="delete-button"]');
      for (let i = 0; i < (await deleteButtons.count()); i++) {
        const button = deleteButtons.nth(i);
        await expect(button).not.toBeVisible();
      }
    });
  });

  test.describe("로그인 유저 시나리오", () => {
    test.beforeEach(async ({ page }) => {
      // 로그인 상태 및 TEST_BYPASS 설정
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

      // 페이지 로드 후 테스트용 일기 데이터 추가
      await page.evaluate(() => {
        localStorage.setItem(
          "diaries",
          JSON.stringify([
            {
              id: 1,
              title: "테스트 일기 1",
              content: "테스트 내용 1",
              emotion: "HAPPY",
              date: "2024-01-01",
              createdAt: "2024-01-01T00:00:00.000Z",
            },
            {
              id: 2,
              title: "테스트 일기 2",
              content: "테스트 내용 2",
              emotion: "SAD",
              date: "2024-01-02",
              createdAt: "2024-01-02T00:00:00.000Z",
            },
          ])
        );
      });

      // 페이지 새로고침하여 데이터 로드
      await page.reload();

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diaries-page"]');
    });

    test("일기카드 각각의 삭제아이콘(X) 노출 확인", async ({ page }) => {
      // 일기 카드가 존재하는지 확인
      const diaryCards = page.locator('[data-testid^="diary-card-"]');
      const count = await diaryCards.count();
      expect(count).toBeGreaterThan(0);

      // 모든 삭제 버튼이 보이는지 확인
      const deleteButtons = page.locator('[data-testid="delete-button"]');
      for (let i = 0; i < (await deleteButtons.count()); i++) {
        const button = deleteButtons.nth(i);
        await expect(button).toBeVisible();
      }
    });

    test("삭제 아이콘 클릭 시 일기삭제 모달이 노출된다", async ({ page }) => {
      // 첫 번째 일기 카드의 삭제 버튼 클릭
      const firstDeleteButton = page
        .locator('[data-testid="delete-button"]')
        .first();
      await firstDeleteButton.click();

      // 삭제 모달이 표시되는지 확인
      const modal = page.locator('text="일기 삭제"');
      await expect(modal).toBeVisible();

      // 삭제 모달 설명 확인
      const description = page.locator('text="일기를 삭제 하시겠어요?"');
      await expect(description).toBeVisible();

      // 취소 버튼 확인
      const cancelButton = page.locator('[data-testid="modal-cancel-button"]');
      await expect(cancelButton).toBeVisible();
      await expect(cancelButton).toHaveText("취소");

      // 삭제 버튼 확인
      const confirmButton = page.locator(
        '[data-testid="modal-confirm-button"]'
      );
      await expect(confirmButton).toBeVisible();
      await expect(confirmButton).toHaveText("삭제");
    });

    test("삭제 모달에서 '취소' 클릭 시 모달이 닫힌다", async ({ page }) => {
      // 첫 번째 일기 카드의 삭제 버튼 클릭
      const firstDeleteButton = page
        .locator('[data-testid="delete-button"]')
        .first();
      await firstDeleteButton.click();

      // 삭제 모달이 표시될 때까지 대기
      await page.waitForSelector('text="일기 삭제"');

      // 취소 버튼 클릭
      await page.click('[data-testid="modal-cancel-button"]');

      // 모달이 닫혔는지 확인
      const modal = page.locator('text="일기 삭제"');
      await expect(modal).not.toBeVisible();
    });

    test("삭제 모달에서 '삭제' 클릭 시 해당 일기가 삭제되고 페이지가 새로고침된다", async ({
      page,
    }) => {
      // 초기 일기 개수 확인
      const initialCards = page.locator('[data-testid^="diary-card-"]');
      const initialCount = await initialCards.count();
      expect(initialCount).toBe(2);

      // 첫 번째 일기의 ID를 저장
      const firstCardId = await page
        .locator('[data-testid^="diary-card-"]')
        .first()
        .getAttribute("data-testid");

      // 첫 번째 일기 카드의 삭제 버튼 클릭
      const firstDeleteButton = page
        .locator('[data-testid="delete-button"]')
        .first();
      await firstDeleteButton.click();

      // 삭제 모달이 표시될 때까지 대기
      await page.waitForSelector('text="일기 삭제"');

      // 페이지 새로고침을 대기하기 위한 Promise 설정
      const navigationPromise = page.waitForNavigation({ waitUntil: "load" });

      // 삭제 버튼 클릭
      await page.click('[data-testid="modal-confirm-button"]');

      // 페이지가 새로고침될 때까지 대기
      await navigationPromise;

      // 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diaries-page"]');

      // 로컬스토리지를 확인하여 삭제가 성공했는지 검증
      const remainingDiariesCount = await page.evaluate(() => {
        const diaries = localStorage.getItem("diaries");
        return diaries ? JSON.parse(diaries).length : 0;
      });
      expect(remainingDiariesCount).toBe(initialCount - 1);

      // 화면에 표시된 일기 개수가 줄어들었는지 확인
      const updatedCards = page.locator('[data-testid^="diary-card-"]');
      const updatedCount = await updatedCards.count();
      expect(updatedCount).toBe(initialCount - 1);

      // 삭제된 일기가 더 이상 존재하지 않는지 확인
      if (firstCardId) {
        const deletedCard = page.locator(`[data-testid="${firstCardId}"]`);
        await expect(deletedCard).not.toBeVisible();
      }
    });

    test("로그인 요청 모달이 표시되지 않는다 (비로그인 유저 테스트)", async ({
      page,
    }) => {
      // 비로그인 상태로 재설정
      await page.addInitScript(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.__TEST_BYPASS__ = false;

        // 테스트용 일기 데이터 유지
        localStorage.setItem(
          "diaries",
          JSON.stringify([
            {
              id: 1,
              title: "테스트 일기 1",
              content: "테스트 내용 1",
              emotion: "HAPPY",
              date: "2024-01-01",
              createdAt: "2024-01-01T00:00:00.000Z",
            },
          ])
        );
      });

      // 페이지 새로고침
      await page.goto("/diaries");
      await page.waitForSelector('[data-testid="diaries-page"]');

      // 삭제 버튼이 숨겨져 있는지 확인
      const deleteButtons = page.locator('[data-testid="delete-button"]');
      for (let i = 0; i < (await deleteButtons.count()); i++) {
        const button = deleteButtons.nth(i);
        await expect(button).not.toBeVisible();
      }
    });
  });
});
