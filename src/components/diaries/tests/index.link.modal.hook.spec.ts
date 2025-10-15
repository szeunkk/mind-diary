import { test, expect } from "@playwright/test";

test.describe("일기 목록 페이지 - 일기쓰기 모달", () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto("/diaries");

    // 페이지가 완전히 로드될 때까지 대기 (일기쓰기 버튼이 보일 때까지)
    await page.waitForSelector('[data-testid="write-diary-button"]');
  });

  test("일기쓰기 버튼 클릭 시 모달이 열린다", async ({ page }) => {
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="write-diary-button"]');

    // 모달이 표시되는지 확인
    const modal = page.locator('[data-testid="diary-new-modal"]');
    await expect(modal).toBeVisible();

    // 모달 제목 확인
    const modalTitle = page.locator('[data-testid="diary-new-title"]');
    await expect(modalTitle).toHaveText("일기 쓰기");
  });

  test("모달의 닫기 버튼 클릭 시 모달이 닫힌다", async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('[data-testid="write-diary-button"]');

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-new-modal"]');
    await expect(modal).toBeVisible();

    // 닫기 버튼 클릭
    await page.click('[data-testid="diary-new-close-button"]');

    // 모달이 사라졌는지 확인
    await expect(modal).not.toBeVisible();
  });

  test("모달이 페이지 중앙에 오버레이되어 표시된다", async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('[data-testid="write-diary-button"]');

    // 모달 컨테이너 확인
    const modalContainer = page.locator(
      ".fixed.inset-0.z-50.flex.items-center.justify-center"
    );
    await expect(modalContainer).toBeVisible();

    // 모달 컨텐츠 확인
    const modal = page.locator('[data-testid="diary-new-modal"]');
    await expect(modal).toBeVisible();
  });
});
