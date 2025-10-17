import { test, expect } from "@playwright/test";
import { Emotion } from "@/commons/constants/enum";

test.describe("일기 목록 페이지 - 라우팅", () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 실제 테스트 데이터 설정
    await page.goto("/diaries");

    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루였어요",
        content: "오늘은 정말 행복한 하루였습니다.",
        emotion: Emotion.Happy,
        createdAt: "2024-03-12T10:30:00.000Z",
      },
      {
        id: 2,
        title: "슬픈 일이 있었어요",
        content: "오늘은 슬픈 일이 있었습니다.",
        emotion: Emotion.Sad,
        createdAt: "2024-03-13T14:20:00.000Z",
      },
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // 페이지 새로고침
    await page.reload();

    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-page"]');
  });

  test("일기 카드 클릭 시 상세 페이지로 이동한다", async ({ page }) => {
    // 첫 번째 일기 카드 클릭 (삭제 버튼이 아닌 카드 영역)
    const firstCard = page.locator('[data-testid="diary-card-1"]');
    await firstCard.click();

    // URL이 /diaries/1로 변경되었는지 확인
    await expect(page).toHaveURL("/diaries/1");
  });

  test("삭제 버튼 클릭 시 페이지 이동하지 않는다", async ({ page }) => {
    // 삭제 버튼 클릭
    const deleteButton = page.locator(
      '[data-testid="diary-card-1"] [data-testid="delete-button"]'
    );
    await deleteButton.click();

    // URL이 여전히 /diaries인지 확인 (페이지 이동하지 않음)
    await expect(page).toHaveURL("/diaries");
  });

  test("일기 카드에 cursor pointer가 적용된다", async ({ page }) => {
    // 첫 번째 카드의 cursor 스타일 확인
    const firstCard = page.locator('[data-testid="diary-card-1"]');
    const cursor = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    expect(cursor).toBe("pointer");
  });

  test("여러 일기 카드가 각각의 ID로 라우팅된다", async ({ page }) => {
    // 두 번째 카드 클릭
    const secondCard = page.locator('[data-testid="diary-card-2"]');
    await secondCard.click();

    // URL이 /diaries/2로 변경되었는지 확인
    await expect(page).toHaveURL("/diaries/2");
  });
});
