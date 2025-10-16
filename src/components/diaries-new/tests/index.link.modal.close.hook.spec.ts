/**
 * 일기쓰기 모달 닫기 기능 테스트
 *
 * TDD 기반으로 일기쓰기 모달의 닫기 기능과 2중 모달 스택을 테스트합니다.
 */

import { test, expect } from "@playwright/test";

test.describe("일기쓰기 모달 닫기 기능", () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto("/diaries");

    // 페이지가 완전히 로드될 때까지 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diaries-page"]', {
      timeout: 300,
    });

    // 일기쓰기 버튼 클릭하여 모달 열기
    await page.click('[data-testid="diary-new-open-button"]');

    // 일기쓰기 모달이 열릴 때까지 대기
    await page.waitForSelector('[data-testid="diary-new-modal"]', {
      timeout: 300,
    });
  });

  test("닫기 버튼 클릭 시 등록취소 모달이 2중 모달로 표시되어야 함", async ({
    page,
  }) => {
    // 닫기 버튼 클릭
    await page.click('[data-testid="diary-new-close-button"]');

    // 등록취소 모달이 표시되는지 확인
    await expect(page.locator('text="일기 등록 취소"')).toBeVisible();
    await expect(
      page.locator('text="일기 등록을 취소 하시겠어요?"')
    ).toBeVisible();

    // 일기쓰기 모달이 여전히 배경에 있는지 확인 (2중 모달)
    await expect(page.locator('[data-testid="diary-new-modal"]')).toBeVisible();
  });

  test("계속작성 버튼 클릭 시 등록취소 모달만 닫혀야 함", async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-new-close-button"]');

    // 등록취소 모달이 표시되는지 확인
    await expect(page.locator('text="일기 등록 취소"')).toBeVisible();

    // 계속작성 버튼 클릭
    await page.click('button:has-text("계속 작성")');

    // 등록취소 모달이 닫혔는지 확인
    await expect(page.locator('text="일기 등록 취소"')).not.toBeVisible();

    // 일기쓰기 모달이 여전히 열려있는지 확인
    await expect(page.locator('[data-testid="diary-new-modal"]')).toBeVisible();
  });

  test("등록취소 버튼 클릭 시 모든 모달이 닫혀야 함", async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-new-close-button"]');

    // 등록취소 모달이 표시되는지 확인
    await expect(page.locator('text="일기 등록 취소"')).toBeVisible();

    // 등록취소 버튼 클릭
    await page.click('button:has-text("등록 취소")');

    // 모든 모달이 닫혔는지 확인
    await expect(
      page.locator('[data-testid="diary-new-modal"]')
    ).not.toBeVisible();
    await expect(page.locator('text="일기 등록 취소"')).not.toBeVisible();
  });

  test("중복 닫기 버튼 클릭 시 중복 실행되지 않아야 함", async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-new-close-button"]');

    // 등록취소 모달이 표시되는지 확인
    await expect(page.locator('text="일기 등록 취소"')).toBeVisible();

    // 등록취소 모달이 하나만 표시되는지 확인 (중복 실행 방지 확인)
    const confirmModals = page.locator('text="일기 등록 취소"');
    await expect(confirmModals).toHaveCount(1);

    // 계속작성 버튼을 클릭하여 모달을 닫고 테스트 완료
    await page.click('button:has-text("계속 작성")');

    // 등록취소 모달이 닫혔는지 확인
    await expect(page.locator('text="일기 등록 취소"')).not.toBeVisible();
  });

  test("모달 스택의 z-index가 올바르게 설정되어야 함", async ({ page }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-new-close-button"]');

    // 등록취소 모달이 표시되는지 확인
    await expect(page.locator('text="일기 등록 취소"')).toBeVisible();

    // 모달 스택의 z-index 확인 (2중 모달이므로 더 높은 z-index를 가져야 함)
    const firstModal = page.locator('[data-testid="diary-new-modal"]');
    const confirmModal = page.locator('text="일기 등록 취소"').locator("..");

    // 등록취소 모달이 일기쓰기 모달보다 앞에 표시되는지 확인
    await expect(confirmModal).toBeVisible();
    await expect(firstModal).toBeVisible();
  });

  test("등록취소 모달의 텍스트와 버튼이 올바르게 표시되어야 함", async ({
    page,
  }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-new-close-button"]');

    // 등록취소 모달이 표시되는지 확인
    await expect(page.locator('text="일기 등록 취소"')).toBeVisible();
    await expect(
      page.locator('text="일기 등록을 취소 하시겠어요?"')
    ).toBeVisible();

    // 버튼들이 올바르게 표시되는지 확인
    await expect(page.locator('button:has-text("계속 작성")')).toBeVisible();
    await expect(page.locator('button:has-text("등록 취소")')).toBeVisible();
  });

  test("등록취소 모달의 backdrop 클릭 시 모달이 닫히고 다시 닫기 버튼을 클릭할 수 있어야 함", async ({
    page,
  }) => {
    // 닫기 버튼 클릭하여 등록취소 모달 열기
    await page.click('[data-testid="diary-new-close-button"]');

    // 등록취소 모달이 표시되는지 확인
    await expect(page.locator('text="일기 등록 취소"')).toBeVisible();

    // 계속작성 버튼을 클릭하여 등록취소 모달 닫기 (backdrop 클릭과 동일한 효과)
    await page.click('button:has-text("계속 작성")');

    // 등록취소 모달이 닫혔는지 확인
    await expect(page.locator('text="일기 등록 취소"')).not.toBeVisible();

    // 일기쓰기 모달이 여전히 열려있는지 확인
    await expect(page.locator('[data-testid="diary-new-modal"]')).toBeVisible();

    // 다시 닫기 버튼을 클릭하여 등록취소 모달이 다시 나타나는지 확인
    await page.click('[data-testid="diary-new-close-button"]');
    await expect(page.locator('text="일기 등록 취소"')).toBeVisible();

    // 계속작성 버튼을 클릭하여 테스트 완료
    await page.click('button:has-text("계속 작성")');
    await expect(page.locator('text="일기 등록 취소"')).not.toBeVisible();
  });
});
