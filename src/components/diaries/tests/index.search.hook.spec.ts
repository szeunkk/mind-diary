import { test, expect } from "@playwright/test";
import { Emotion } from "@/commons/constants/enum";

test.describe("일기 검색 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 로컬스토리지에 실제 테스트 데이터 설정
    await page.goto("/diaries");

    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루",
        content: "오늘은 정말 행복한 하루였다.",
        emotion: Emotion.Happy,
        createdAt: "2025-01-15T10:00:00.000Z",
      },
      {
        id: 2,
        title: "슬픈 일기",
        content: "오늘은 슬픈 일이 있었다.",
        emotion: Emotion.Sad,
        createdAt: "2025-01-16T10:00:00.000Z",
      },
      {
        id: 3,
        title: "행복한 주말",
        content: "주말에 가족과 함께 즐거운 시간을 보냈다.",
        emotion: Emotion.Happy,
        createdAt: "2025-01-17T10:00:00.000Z",
      },
      {
        id: 4,
        title: "놀라운 경험",
        content: "오늘 놀라운 일이 있었다.",
        emotion: Emotion.Surprise,
        createdAt: "2025-01-18T10:00:00.000Z",
      },
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // 페이지 리로드하여 데이터 반영
    await page.reload();

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-page"]');
  });

  test("검색창에 검색어 입력 후 엔터키를 누르면 title에 검색어가 포함된 일기만 표시된다", async ({
    page,
  }) => {
    // 검색 전 모든 일기 카드가 표시되는지 확인
    const allCards = page.locator('[data-testid^="diary-card-"]');
    await expect(allCards).toHaveCount(4);

    // 검색창 찾기
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await expect(searchInput).toBeVisible();

    // 검색어 입력
    await searchInput.fill("행복");

    // 엔터키 입력
    await searchInput.press("Enter");

    // 검색 후 title에 "행복"이 포함된 일기만 표시되는지 확인
    // Playwright의 auto-waiting이 카드 수가 2개가 될 때까지 자동 대기
    const filteredCards = page.locator('[data-testid^="diary-card-"]');
    await expect(filteredCards).toHaveCount(2);

    // 각 카드의 제목 확인
    const firstCardTitle = filteredCards
      .nth(0)
      .locator('[data-testid="diary-title"]');
    const secondCardTitle = filteredCards
      .nth(1)
      .locator('[data-testid="diary-title"]');

    await expect(firstCardTitle).toContainText("행복");
    await expect(secondCardTitle).toContainText("행복");
  });

  test("검색창에 검색어 입력 후 돋보기 아이콘을 클릭하면 title에 검색어가 포함된 일기만 표시된다", async ({
    page,
  }) => {
    // 검색창 찾기
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await expect(searchInput).toBeVisible();

    // 검색어 입력
    await searchInput.fill("슬픈");

    // 돋보기 아이콘 찾기 (SearchBar 컴포넌트 내부의 icon)
    const searchIcon = page.locator('img[alt="search icon"]');
    await expect(searchIcon).toBeVisible();

    // 돋보기 아이콘의 부모 또는 컨테이너 클릭
    const iconWrapper = searchIcon.locator("..");
    await iconWrapper.click();

    // 검색 후 title에 "슬픈"이 포함된 일기만 표시되는지 확인
    // Playwright의 auto-waiting이 카드 수가 1개가 될 때까지 자동 대기
    const filteredCards = page.locator('[data-testid^="diary-card-"]');
    await expect(filteredCards).toHaveCount(1);

    // 카드의 제목 확인
    const cardTitle = filteredCards
      .nth(0)
      .locator('[data-testid="diary-title"]');
    await expect(cardTitle).toContainText("슬픈");
  });

  test("검색어가 없는 경우 모든 일기가 표시된다", async ({ page }) => {
    // 검색창 찾기
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await expect(searchInput).toBeVisible();

    // 빈 검색어로 검색
    await searchInput.fill("");
    await searchInput.press("Enter");

    // 모든 일기 카드가 표시되는지 확인
    // Playwright의 auto-waiting이 카드 수가 4개가 될 때까지 자동 대기
    const allCards = page.locator('[data-testid^="diary-card-"]');
    await expect(allCards).toHaveCount(4);
  });

  test("검색 결과가 없는 경우 일기 카드가 표시되지 않는다", async ({
    page,
  }) => {
    // 검색창 찾기
    const searchInput = page.locator(
      'input[placeholder="검색어를 입력해 주세요."]'
    );
    await expect(searchInput).toBeVisible();

    // 존재하지 않는 검색어로 검색
    await searchInput.fill("존재하지않는검색어");
    await searchInput.press("Enter");

    // 일기 카드가 표시되지 않는지 확인
    // Playwright의 auto-waiting이 카드 수가 0개가 될 때까지 자동 대기
    const filteredCards = page.locator('[data-testid^="diary-card-"]');
    await expect(filteredCards).toHaveCount(0);
  });
});
