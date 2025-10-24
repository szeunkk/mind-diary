import { test, expect, Page } from "@playwright/test";
import { Emotion } from "@/commons/constants/enum";

/**
 * 일기 삭제 기능 테스트
 * TDD 기반으로 작성된 테스트 시나리오
 */

// 테스트 데이터 준비
const testDiary1 = {
  id: 1,
  title: "삭제할 일기 제목",
  content: "삭제할 일기 내용입니다.",
  emotion: Emotion.Happy,
  createdAt: new Date().toISOString(),
};

const testDiary2 = {
  id: 2,
  title: "유지될 일기 제목",
  content: "유지될 일기 내용입니다.",
  emotion: Emotion.Sad,
  createdAt: new Date().toISOString(),
};

/**
 * 로컬스토리지에 테스트 데이터 설정
 */
async function setupTestDiaries(page: Page) {
  await page.evaluate(
    (diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    },
    [testDiary1, testDiary2]
  );
}

test.describe("일기 삭제 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태 설정 (모든 페이지 로드 시 적용)
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

    // 로컬스토리지 초기화 및 테스트 데이터 설정
    await page.goto("/diaries/1");
    await setupTestDiaries(page);
    await page.reload();
  });

  test("삭제 버튼 클릭 시 삭제 모달 노출", async ({ page }) => {
    // 페이지 로드 확인 (data-testid 대기)
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 500 }
    );

    // 삭제 버튼 찾기 및 클릭
    const deleteButton = page.getByRole("button", { name: "삭제" });
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // 삭제 모달 노출 확인
    await page.waitForSelector('[data-testid="delete-modal"]', {
      timeout: 500,
    });

    // 모달 제목 확인
    const modalTitle = page.locator('[data-testid="delete-modal-title"]');
    await expect(modalTitle).toHaveText("일기 삭제");

    // 모달 설명 확인
    const modalDescription = page.locator(
      '[data-testid="delete-modal-description"]'
    );
    await expect(modalDescription).toHaveText("일기를 삭제 하시겠어요?");

    // 취소 버튼 확인
    const cancelButton = page
      .locator('[data-testid="delete-modal"]')
      .getByRole("button", { name: "취소" });
    await expect(cancelButton).toBeVisible();

    // 삭제 버튼 확인
    const confirmDeleteButton = page
      .locator('[data-testid="delete-modal"]')
      .getByRole("button", { name: "삭제" });
    await expect(confirmDeleteButton).toBeVisible();
  });

  test("삭제 모달에서 취소 버튼 클릭 시 모달 닫기", async ({ page }) => {
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 500 }
    );

    // 삭제 버튼 클릭
    const deleteButton = page.getByRole("button", { name: "삭제" });
    await deleteButton.click();

    // 삭제 모달 노출 확인
    await page.waitForSelector('[data-testid="delete-modal"]', {
      timeout: 500,
    });

    // 취소 버튼 클릭
    const cancelButton = page
      .locator('[data-testid="delete-modal"]')
      .getByRole("button", { name: "취소" });
    await cancelButton.click();

    // 모달이 닫혔는지 확인
    await expect(
      page.locator('[data-testid="delete-modal"]')
    ).not.toBeVisible();

    // 페이지는 그대로 유지되는지 확인
    await expect(page).toHaveURL("/diaries/1");

    // 데이터가 그대로 있는지 확인
    const title = page.locator('[data-testid="diary-title"]');
    await expect(title).toHaveText(testDiary1.title);
  });

  test("삭제 모달에서 삭제 버튼 클릭 시 일기 삭제 및 목록 페이지로 이동", async ({
    page,
  }) => {
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 500 }
    );

    // 삭제 버튼 클릭
    const deleteButton = page.getByRole("button", { name: "삭제" });
    await deleteButton.click();

    // 삭제 모달 노출 확인
    await page.waitForSelector('[data-testid="delete-modal"]', {
      timeout: 500,
    });

    // 삭제 버튼 클릭
    const confirmDeleteButton = page
      .locator('[data-testid="delete-modal"]')
      .getByRole("button", { name: "삭제" });
    await confirmDeleteButton.click();

    // /diaries 페이지로 이동 확인
    await page.waitForURL("/diaries");
    await expect(page).toHaveURL("/diaries");

    // 로컬스토리지에서 삭제 확인
    const savedDiaries = await page.evaluate(() => {
      const data = localStorage.getItem("diaries");
      return data ? JSON.parse(data) : [];
    });

    // testDiary1은 삭제되고 testDiary2만 남아있어야 함
    expect(savedDiaries).toHaveLength(1);
    expect(savedDiaries[0].id).toBe(testDiary2.id);
    expect(savedDiaries[0].title).toBe(testDiary2.title);
  });

  test("ESC 키로 삭제 모달 닫기", async ({ page }) => {
    // 페이지 로드 확인
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 500 }
    );

    // 삭제 버튼 클릭
    const deleteButton = page.getByRole("button", { name: "삭제" });
    await deleteButton.click();

    // 삭제 모달 노출 확인
    await page.waitForSelector('[data-testid="delete-modal"]', {
      timeout: 500,
    });

    // ESC 키 누르기
    await page.keyboard.press("Escape");

    // 모달이 닫혔는지 확인
    await expect(
      page.locator('[data-testid="delete-modal"]')
    ).not.toBeVisible();

    // 페이지는 그대로 유지되는지 확인
    await expect(page).toHaveURL("/diaries/1");
  });
});
