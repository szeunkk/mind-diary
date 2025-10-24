import { test, expect } from "@playwright/test";

test.describe("회고 바인딩 Hook 테스트", () => {
  test.beforeEach(async ({ page, context }) => {
    // 로컬스토리지 초기화
    await context.clearCookies();
    await page.goto("/diaries/1");
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("해당 diaryId의 회고만 필터링하여 표시되어야 함", async ({ page }) => {
    // Given: 로컬스토리지에 여러 일기의 회고 데이터 저장
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: "첫 번째 일기의 회고입니다",
          diaryId: 1,
          createdAt: "2024-01-15T10:00:00.000Z",
        },
        {
          id: 2,
          content: "두 번째 일기의 회고입니다",
          diaryId: 2,
          createdAt: "2024-01-16T10:00:00.000Z",
        },
        {
          id: 3,
          content: "첫 번째 일기의 두 번째 회고입니다",
          diaryId: 1,
          createdAt: "2024-01-17T10:00:00.000Z",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    });

    // When: 페이지 로드 (diaryId = 1)
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // Then: diaryId가 1인 회고만 표시되어야 함
    const retrospectTexts = await page
      .locator('[data-testid="retrospect-text"]')
      .allTextContents();

    expect(retrospectTexts).toHaveLength(2);
    expect(retrospectTexts).toContain("첫 번째 일기의 회고입니다");
    expect(retrospectTexts).toContain("첫 번째 일기의 두 번째 회고입니다");
    expect(retrospectTexts).not.toContain("두 번째 일기의 회고입니다");
  });

  test("해당 diaryId의 회고가 없으면 빈 목록이 표시되어야 함", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 다른 일기의 회고만 존재
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: "두 번째 일기의 회고입니다",
          diaryId: 2,
          createdAt: "2024-01-15T10:00:00.000Z",
        },
        {
          id: 2,
          content: "세 번째 일기의 회고입니다",
          diaryId: 3,
          createdAt: "2024-01-16T10:00:00.000Z",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    });

    // When: 페이지 로드 (diaryId = 1)
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // Then: 회고가 표시되지 않아야 함
    const retrospectTexts = await page
      .locator('[data-testid="retrospect-text"]')
      .all();

    expect(retrospectTexts).toHaveLength(0);
  });

  test("로컬스토리지가 비어있으면 빈 목록이 표시되어야 함", async ({
    page,
  }) => {
    // Given: 로컬스토리지가 비어있음 (beforeEach에서 clear됨)

    // When: 페이지 로드
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // Then: 회고가 표시되지 않아야 함
    const retrospectTexts = await page
      .locator('[data-testid="retrospect-text"]')
      .all();

    expect(retrospectTexts).toHaveLength(0);
  });

  test("회고 날짜가 YYYY. MM. DD 형식으로 표시되어야 함", async ({ page }) => {
    // Given: 로컬스토리지에 회고 데이터 저장
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: "테스트 회고",
          diaryId: 1,
          createdAt: "2024-03-15T10:00:00.000Z",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    });

    // When: 페이지 로드
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // Then: 날짜가 YYYY. MM. DD 형식으로 표시되어야 함
    const retrospectDate = await page
      .locator('[data-testid="retrospect-date"]')
      .first()
      .textContent();

    expect(retrospectDate).toMatch(/\[\d{4}\. \d{2}\. \d{2}\]/);
  });

  test("여러 회고가 최신순으로 정렬되어야 함", async ({ page }) => {
    // Given: 로컬스토리지에 날짜가 다른 여러 회고 저장
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: "첫 번째 회고",
          diaryId: 1,
          createdAt: "2024-01-15T10:00:00.000Z",
        },
        {
          id: 3,
          content: "세 번째 회고",
          diaryId: 1,
          createdAt: "2024-01-17T10:00:00.000Z",
        },
        {
          id: 2,
          content: "두 번째 회고",
          diaryId: 1,
          createdAt: "2024-01-16T10:00:00.000Z",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    });

    // When: 페이지 로드
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // Then: id 기준 최신순 정렬 (id가 클수록 최신)
    const retrospectTexts = await page
      .locator('[data-testid="retrospect-text"]')
      .allTextContents();

    expect(retrospectTexts[0]).toBe("세 번째 회고");
    expect(retrospectTexts[1]).toBe("두 번째 회고");
    expect(retrospectTexts[2]).toBe("첫 번째 회고");
  });
});
