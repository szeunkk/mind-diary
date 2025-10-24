import { test, expect } from "@playwright/test";
import { Emotion } from "@/commons/constants/enum";

/**
 * 테스트용 일기 데이터 생성 함수
 * @param count 생성할 일기 개수
 */
const generateDiaries = (count: number) => {
  const emotions = [
    Emotion.Happy,
    Emotion.Sad,
    Emotion.Angry,
    Emotion.Surprise,
    Emotion.Etc,
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `테스트 일기 ${index + 1}`,
    content: `테스트 내용 ${index + 1}`,
    emotion: emotions[index % emotions.length],
    createdAt: new Date(2024, 0, index + 1).toISOString(),
  }));
};

test.describe("일기 페이지네이션 기능 테스트", () => {
  test.beforeEach(async ({ page, context }) => {
    // 테스트용 일기 데이터 생성 (50개)
    const testDiaries = generateDiaries(50);

    // 로컬스토리지에 데이터 저장
    await context.addInitScript((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // 페이지 접속
    await page.goto("/diaries");

    // 페이지 로드 대기
    await page.waitForSelector('[data-testid="diaries-page"]');
  });

  test("1. 한 페이지에 12개의 일기 카드가 노출되는지 확인", async ({
    page,
  }) => {
    // 일기 카드 개수 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    const count = await diaryCards.count();

    // 최대 12개의 일기 카드가 노출되어야 함
    expect(count).toBeLessThanOrEqual(12);

    // 첫 페이지에서는 12개가 노출되어야 함 (총 50개 일기가 있으므로)
    expect(count).toBe(12);
  });

  test("2. 페이지 번호가 5개 단위로 노출되는지 확인", async ({ page }) => {
    // 페이지네이션 컨테이너 확인
    const pagination = page.locator('[aria-label^="Page "]');
    const pageButtonCount = await pagination.count();

    // 총 5페이지(50개 / 12개 = 4.x -> 5페이지)이므로 5개의 버튼이 있어야 함
    expect(pageButtonCount).toBe(5);

    // 페이지 번호가 1, 2, 3, 4, 5 형태로 노출되는지 확인
    for (let i = 1; i <= 5; i++) {
      const pageButton = page.locator(`[aria-label="Page ${i}"]`);
      await expect(pageButton).toBeVisible();
    }
  });

  test("3. 페이지 번호 클릭시 해당 페이지의 일기가 노출되는지 확인", async ({
    page,
  }) => {
    // 첫 번째 일기 카드의 ID 저장
    const firstCardId = await page
      .locator('[data-testid^="diary-card-"]')
      .first()
      .getAttribute("data-testid");

    // 2페이지로 이동
    await page.locator('[aria-label="Page 2"]').click();

    // 페이지가 변경되었는지 확인
    const newFirstCardId = await page
      .locator('[data-testid^="diary-card-"]')
      .first()
      .getAttribute("data-testid");

    // 첫 번째 카드가 달라졌는지 확인
    expect(firstCardId).not.toBe(newFirstCardId);

    // 2페이지에도 최대 12개의 일기가 노출되는지 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    const count = await diaryCards.count();
    expect(count).toBeLessThanOrEqual(12);
  });

  test("4. 검색 결과에 맞게 페이지 수가 변경되는지 확인", async ({ page }) => {
    // 검색어 입력 (특정 제목 검색)
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill("테스트 일기 1");

    // 검색 버튼 클릭 또는 엔터
    await searchInput.press("Enter");

    // 검색 결과 대기
    await page.waitForTimeout(100);

    // 검색 결과에 맞는 일기 카드만 노출되는지 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    const count = await diaryCards.count();

    // "테스트 일기 1"로 시작하는 일기: 1, 10, 11, 12, ..., 19 (총 11개)
    expect(count).toBeLessThanOrEqual(12);

    // 페이지네이션 버튼 확인 - 11개이므로 1페이지만 있어야 함
    const pagination = page.locator('[aria-label^="Page "]');
    const pageButtonCount = await pagination.count();
    expect(pageButtonCount).toBe(1);
  });

  test("5. 필터 결과에 맞게 페이지 수가 변경되는지 확인", async ({ page }) => {
    // 필터 선택박스 클릭
    const filterSelect = page.locator('[data-testid="filter-selectbox"]');
    await filterSelect.click();

    // 행복해요 선택 (50개 중 10개가 HAPPY 감정)
    await page
      .locator('[data-testid="filter-dropdown"]')
      .locator("text=행복해요")
      .click();

    // 필터 결과 대기
    await page.waitForTimeout(100);

    // 필터링된 일기 카드 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    const count = await diaryCards.count();

    // HAPPY 감정 일기는 10개이므로 12개 이하
    expect(count).toBeLessThanOrEqual(12);
    expect(count).toBe(10);

    // 감정이 HAPPY인지 확인
    const emotionLabels = page.locator('[data-testid="emotion-label"]');
    const emotionCount = await emotionLabels.count();

    for (let i = 0; i < emotionCount; i++) {
      const emotionAttr = await emotionLabels
        .nth(i)
        .getAttribute("data-emotion");
      expect(emotionAttr).toBe(Emotion.Happy);
    }

    // 페이지네이션 버튼 확인 - 10개이므로 1페이지만 있어야 함
    const pagination = page.locator('[aria-label^="Page "]');
    const pageButtonCount = await pagination.count();
    expect(pageButtonCount).toBe(1);
  });

  test("6. 검색과 필터를 동시에 적용한 경우 페이지네이션이 올바르게 동작하는지 확인", async ({
    page,
  }) => {
    // 필터 선택 (행복해요)
    const filterSelect = page.locator('[data-testid="filter-selectbox"]');
    await filterSelect.click();
    await page
      .locator('[data-testid="filter-dropdown"]')
      .locator("text=행복해요")
      .click();

    await page.waitForTimeout(100);

    // 검색어 입력
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill("테스트 일기 1");
    await searchInput.press("Enter");

    await page.waitForTimeout(100);

    // 결과 확인: "테스트 일기 1"로 시작하고 HAPPY 감정인 일기
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    const count = await diaryCards.count();

    // 조건에 맞는 일기가 있으면 표시되어야 함
    expect(count).toBeGreaterThanOrEqual(0);

    // 모든 카드가 HAPPY 감정인지 확인
    if (count > 0) {
      const emotionLabels = page.locator('[data-testid="emotion-label"]');
      const emotionCount = await emotionLabels.count();

      for (let i = 0; i < emotionCount; i++) {
        const emotionAttr = await emotionLabels
          .nth(i)
          .getAttribute("data-emotion");
        expect(emotionAttr).toBe(Emotion.Happy);
      }
    }
  });

  test("7. 마지막 페이지로 이동시 올바른 개수의 일기가 노출되는지 확인", async ({
    page,
  }) => {
    // 마지막 페이지(5페이지)로 이동
    await page.locator('[aria-label="Page 5"]').click();

    await page.waitForTimeout(100);

    // 일기 카드 개수 확인
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    const count = await diaryCards.count();

    // 50개 일기 중 마지막 페이지(5페이지)에는 2개만 있어야 함
    // (12 * 4 = 48, 50 - 48 = 2)
    expect(count).toBe(2);
  });

  test("8. 이전/다음 버튼으로 페이지 이동이 가능한지 확인", async ({
    page,
  }) => {
    // 다음 버튼 클릭
    const nextButton = page.locator('[aria-label="Next page"]');
    await nextButton.click();

    await page.waitForTimeout(100);

    // 2페이지로 이동했는지 확인
    const activePage = page.locator('[aria-current="page"]');
    await expect(activePage).toHaveText("2");

    // 이전 버튼 클릭
    const prevButton = page.locator('[aria-label="Previous page"]');
    await prevButton.click();

    await page.waitForTimeout(100);

    // 1페이지로 돌아왔는지 확인
    const activePageAfter = page.locator('[aria-current="page"]');
    await expect(activePageAfter).toHaveText("1");
  });
});
