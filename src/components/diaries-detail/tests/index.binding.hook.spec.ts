import { test, expect } from "@playwright/test";
import { Emotion } from "@/commons/constants/enum";

/**
 * DiariesDetail Binding Hook 테스트
 * - TDD 기반으로 작성
 * - 로컬스토리지의 실제 데이터를 사용
 * - Mock 데이터 사용 금지
 * - 로컬스토리지 모킹 금지
 */

test.describe("DiariesDetail Binding Hook", () => {
  // 테스트용 실제 데이터
  const testDiaries = [
    {
      id: 1,
      title: "행복한 하루",
      content: "오늘은 정말 행복한 하루였다.",
      emotion: Emotion.Happy,
      createdAt: "2024. 10. 15",
    },
    {
      id: 2,
      title: "슬픈 하루",
      content: "오늘은 조금 슬펐다.",
      emotion: Emotion.Sad,
      createdAt: "2024. 10. 16",
    },
    {
      id: 3,
      title: "화난 하루",
      content: "오늘은 정말 화가 났다.",
      emotion: Emotion.Angry,
      createdAt: "2024. 10. 17",
    },
  ];

  test.beforeEach(async ({ context }) => {
    // 로컬스토리지에 실제 테스트 데이터 설정
    await context.addInitScript((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);
  });

  test("일기 ID 1번의 상세 정보가 올바르게 바인딩되어야 함", async ({
    page,
  }) => {
    // 일기 ID 1번 페이지로 이동
    await page.goto("/diaries/1");

    // data-testid를 사용하여 페이지 로드 대기
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기 (제목이 빈 문자열이 아닐 때까지)
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return titleEl && titleEl.textContent && titleEl.textContent.trim() !== "";
      },
      { timeout: 1000 }
    );

    // 제목 확인
    const title = await page.textContent('[data-testid="diary-title"]');
    expect(title).toBe("행복한 하루");

    // 감정 텍스트 확인
    const emotionText = await page.textContent(
      '[data-testid="diary-emotion-text"]'
    );
    expect(emotionText).toBe("행복해요");

    // 작성일 확인
    const createdAt = await page.textContent(
      '[data-testid="diary-created-at"]'
    );
    expect(createdAt).toBe("2024. 10. 15");

    // 내용 확인
    const content = await page.textContent('[data-testid="diary-content"]');
    expect(content).toBe("오늘은 정말 행복한 하루였다.");
  });

  test("일기 ID 2번의 상세 정보가 올바르게 바인딩되어야 함", async ({
    page,
  }) => {
    await page.goto("/diaries/2");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return titleEl && titleEl.textContent && titleEl.textContent.trim() !== "";
      },
      { timeout: 1000 }
    );

    const title = await page.textContent('[data-testid="diary-title"]');
    expect(title).toBe("슬픈 하루");

    const emotionText = await page.textContent(
      '[data-testid="diary-emotion-text"]'
    );
    expect(emotionText).toBe("슬퍼요");

    const createdAt = await page.textContent(
      '[data-testid="diary-created-at"]'
    );
    expect(createdAt).toBe("2024. 10. 16");

    const content = await page.textContent('[data-testid="diary-content"]');
    expect(content).toBe("오늘은 조금 슬펐다.");
  });

  test("일기 ID 3번의 상세 정보가 올바르게 바인딩되어야 함", async ({
    page,
  }) => {
    await page.goto("/diaries/3");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 로드될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return titleEl && titleEl.textContent && titleEl.textContent.trim() !== "";
      },
      { timeout: 1000 }
    );

    const title = await page.textContent('[data-testid="diary-title"]');
    expect(title).toBe("화난 하루");

    const emotionText = await page.textContent(
      '[data-testid="diary-emotion-text"]'
    );
    expect(emotionText).toBe("화나요");

    const createdAt = await page.textContent(
      '[data-testid="diary-created-at"]'
    );
    expect(createdAt).toBe("2024. 10. 17");

    const content = await page.textContent('[data-testid="diary-content"]');
    expect(content).toBe("오늘은 정말 화가 났다.");
  });

  test("존재하지 않는 ID의 경우 데이터가 없어야 함", async ({ page }) => {
    await page.goto("/diaries/999");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 없을 때의 처리 확인 (빈 상태 또는 기본값)
    const title = await page.textContent('[data-testid="diary-title"]');
    expect(title).toBe("");
  });

  test("감정 이미지가 올바르게 표시되어야 함", async ({ page }) => {
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 감정 이미지 src 확인
    const emotionImage = await page.getAttribute(
      '[data-testid="diary-emotion-image"]',
      "src"
    );
    expect(emotionImage).toContain("emotion-happy");
  });
});
