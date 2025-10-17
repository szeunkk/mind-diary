import { test, expect } from "@playwright/test";
import { Emotion } from "@/commons/constants/enum";

test.describe("일기 목록 페이지 - 데이터 바인딩", () => {
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
      {
        id: 3,
        title: "화가 났어요",
        content: "오늘은 화가 났습니다.",
        emotion: Emotion.Angry,
        createdAt: "2024-03-14T09:15:00.000Z",
      },
      {
        id: 4,
        title: "놀라운 일이 있었어요",
        content: "오늘은 놀라운 일이 있었습니다.",
        emotion: Emotion.Surprise,
        createdAt: "2024-03-15T16:45:00.000Z",
      },
      {
        id: 5,
        title:
          "타이틀 영역 입니다. 한줄까지만 노출 됩니다. 아주 긴 제목의 경우 말줄임표가 표시되어야 합니다.",
        content: "기타 감정입니다.",
        emotion: Emotion.Etc,
        createdAt: "2024-03-16T11:00:00.000Z",
      },
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // 페이지 새로고침하여 로컬스토리지 데이터 로드
    await page.reload();

    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-page"]');
  });

  test("로컬스토리지의 일기 데이터가 화면에 렌더링된다", async ({ page }) => {
    // 첫 번째 일기 카드 확인
    const firstCard = page.locator('[data-testid="diary-card-1"]');
    await expect(firstCard).toBeVisible();

    // 두 번째 일기 카드 확인
    const secondCard = page.locator('[data-testid="diary-card-2"]');
    await expect(secondCard).toBeVisible();

    // 총 5개의 카드가 렌더링되는지 확인
    const allCards = page.locator('[data-testid^="diary-card-"]');
    await expect(allCards).toHaveCount(5);
  });

  test("감정 이미지가 올바르게 표시된다", async ({ page }) => {
    // 첫 번째 카드(Happy)의 이미지 확인
    const happyImage = page.locator('[data-testid="diary-card-1"] img').first();
    const happyImageSrc = await happyImage.getAttribute("src");
    expect(happyImageSrc).toContain("emotion-happy");

    // 두 번째 카드(Sad)의 이미지 확인
    const sadImage = page.locator('[data-testid="diary-card-2"] img').first();
    const sadImageSrc = await sadImage.getAttribute("src");
    expect(sadImageSrc).toContain("emotion-sad");

    // 세 번째 카드(Angry)의 이미지 확인
    const angryImage = page.locator('[data-testid="diary-card-3"] img').first();
    const angryImageSrc = await angryImage.getAttribute("src");
    expect(angryImageSrc).toContain("emotion-angry");
  });

  test("감정 텍스트가 올바르게 표시된다", async ({ page }) => {
    // 첫 번째 카드의 감정 텍스트 확인
    const emotionText = page.locator(
      '[data-testid="diary-card-1"] [data-testid="emotion-label"]'
    );
    await expect(emotionText).toHaveText("행복해요");

    // 두 번째 카드의 감정 텍스트 확인
    const sadEmotionText = page.locator(
      '[data-testid="diary-card-2"] [data-testid="emotion-label"]'
    );
    await expect(sadEmotionText).toHaveText("슬퍼요");

    // 세 번째 카드의 감정 텍스트 확인
    const angryEmotionText = page.locator(
      '[data-testid="diary-card-3"] [data-testid="emotion-label"]'
    );
    await expect(angryEmotionText).toHaveText("화나요");

    // 네 번째 카드의 감정 텍스트 확인
    const surpriseEmotionText = page.locator(
      '[data-testid="diary-card-4"] [data-testid="emotion-label"]'
    );
    await expect(surpriseEmotionText).toHaveText("놀랐어요");

    // 다섯 번째 카드의 감정 텍스트 확인
    const etcEmotionText = page.locator(
      '[data-testid="diary-card-5"] [data-testid="emotion-label"]'
    );
    await expect(etcEmotionText).toHaveText("기타");
  });

  test("모든 감정 enum 타입이 올바르게 바인딩된다", async ({ page }) => {
    // data-emotion 속성이 enum 값과 일치하는지 확인
    const happyEmotion = page.locator(
      '[data-testid="diary-card-1"] [data-testid="emotion-label"]'
    );
    const happyEmotionAttr = await happyEmotion.getAttribute("data-emotion");
    expect(happyEmotionAttr).toBe("HAPPY");

    const sadEmotion = page.locator(
      '[data-testid="diary-card-2"] [data-testid="emotion-label"]'
    );
    const sadEmotionAttr = await sadEmotion.getAttribute("data-emotion");
    expect(sadEmotionAttr).toBe("SAD");

    const angryEmotion = page.locator(
      '[data-testid="diary-card-3"] [data-testid="emotion-label"]'
    );
    const angryEmotionAttr = await angryEmotion.getAttribute("data-emotion");
    expect(angryEmotionAttr).toBe("ANGRY");

    const surpriseEmotion = page.locator(
      '[data-testid="diary-card-4"] [data-testid="emotion-label"]'
    );
    const surpriseEmotionAttr = await surpriseEmotion.getAttribute(
      "data-emotion"
    );
    expect(surpriseEmotionAttr).toBe("SURPRISE");

    const etcEmotion = page.locator(
      '[data-testid="diary-card-5"] [data-testid="emotion-label"]'
    );
    const etcEmotionAttr = await etcEmotion.getAttribute("data-emotion");
    expect(etcEmotionAttr).toBe("ETC");
  });

  test("날짜가 YYYY. MM. DD 형식으로 표시된다", async ({ page }) => {
    // 첫 번째 카드의 날짜 확인
    const dateText = page.locator(
      '[data-testid="diary-card-1"] [data-testid="diary-date"]'
    );
    await expect(dateText).toHaveText("2024. 03. 12");

    // 두 번째 카드의 날짜 확인
    const secondDateText = page.locator(
      '[data-testid="diary-card-2"] [data-testid="diary-date"]'
    );
    await expect(secondDateText).toHaveText("2024. 03. 13");

    // 세 번째 카드의 날짜 확인
    const thirdDateText = page.locator(
      '[data-testid="diary-card-3"] [data-testid="diary-date"]'
    );
    await expect(thirdDateText).toHaveText("2024. 03. 14");
  });

  test("날짜 포맷 정규식이 ISO 8601 형식을 올바르게 변환한다", async ({
    page,
  }) => {
    // ISO 형식의 다양한 시간대 테스트
    const dateText = page.locator(
      '[data-testid="diary-card-1"] [data-testid="diary-date"]'
    );
    const dateValue = await dateText.textContent();

    // 정규표현식으로 YYYY. MM. DD 형식 검증
    const datePattern = /^\d{4}\.\s\d{2}\.\s\d{2}$/;
    expect(datePattern.test(dateValue || "")).toBeTruthy();
  });

  test("제목이 올바르게 표시된다", async ({ page }) => {
    // 첫 번째 카드의 제목 확인
    const titleText = page.locator(
      '[data-testid="diary-card-1"] [data-testid="diary-title"]'
    );
    await expect(titleText).toHaveText("행복한 하루였어요");
  });

  test("긴 제목은 ellipsis로 표시된다", async ({ page }) => {
    // 5번째 카드의 긴 제목 확인
    const longTitle = page.locator(
      '[data-testid="diary-card-5"] [data-testid="diary-title"]'
    );

    // 제목이 존재하는지 확인
    await expect(longTitle).toBeVisible();

    // CSS overflow 속성 확인
    const overflow = await longTitle.evaluate((el) => {
      return window.getComputedStyle(el).overflow;
    });
    expect(overflow).toBe("hidden");

    // CSS text-overflow 속성 확인
    const textOverflow = await longTitle.evaluate((el) => {
      return window.getComputedStyle(el).textOverflow;
    });
    expect(textOverflow).toBe("ellipsis");

    // CSS white-space 속성 확인
    const whiteSpace = await longTitle.evaluate((el) => {
      return window.getComputedStyle(el).whiteSpace;
    });
    expect(whiteSpace).toBe("nowrap");
  });

  test("로컬스토리지에 데이터가 없으면 빈 상태가 표시된다", async ({
    page,
  }) => {
    // 로컬스토리지 초기화
    await page.evaluate(() => {
      localStorage.removeItem("diaries");
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]');

    // 일기 카드가 없는지 확인
    const cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(0);
  });

  test("잘못된 형식의 로컬스토리지 데이터를 안전하게 처리한다", async ({
    page,
  }) => {
    // 잘못된 JSON 형식 설정
    await page.evaluate(() => {
      localStorage.setItem("diaries", "invalid json");
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]');

    // 에러 없이 빈 상태 표시
    const cards = page.locator('[data-testid^="diary-card-"]');
    await expect(cards).toHaveCount(0);
  });

  test("이미 포맷된 날짜 형식을 그대로 유지한다", async ({ page }) => {
    // 이미 YYYY. MM. DD 형식의 데이터 설정
    const formattedDiaries = [
      {
        id: 100,
        title: "포맷된 날짜 테스트",
        content: "이미 포맷된 날짜",
        emotion: Emotion.Happy,
        createdAt: "2024. 01. 01",
      },
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, formattedDiaries);

    await page.reload();
    await page.waitForSelector('[data-testid="diaries-page"]');

    const dateText = page.locator(
      '[data-testid="diary-card-100"] [data-testid="diary-date"]'
    );
    await expect(dateText).toHaveText("2024. 01. 01");
  });
});
