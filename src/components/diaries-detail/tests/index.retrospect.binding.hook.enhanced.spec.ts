import { test, expect } from "@playwright/test";

/**
 * 회고 바인딩 Hook 강화 테스트
 *
 * 기본 테스트(index.retrospect.binding.hook.spec.ts)에서 커버하지 못한
 * 엣지 케이스와 에러 처리를 테스트합니다.
 */
test.describe("회고 바인딩 Hook 강화 테스트 (엣지 케이스 & 에러 처리)", () => {
  test.beforeEach(async ({ page, context }) => {
    // 로컬스토리지 초기화
    await context.clearCookies();
    await page.goto("/diaries/1");
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("잘못된 JSON 형식일 때 에러 처리 후 빈 목록을 표시해야 함", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 잘못된 JSON 저장
    await page.evaluate(() => {
      localStorage.setItem("retrospects", "{ invalid json }");
    });

    // When: 페이지 로드
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // Then: 에러가 발생해도 앱이 크래시하지 않고 빈 목록 표시
    const retrospectTexts = await page
      .locator('[data-testid="retrospect-text"]')
      .all();

    expect(retrospectTexts).toHaveLength(0);
  });

  test("createdAt이 잘못된 형식일 때 원본 문자열을 그대로 표시해야 함", async ({
    page,
  }) => {
    // Given: createdAt이 잘못된 형식인 회고
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: "테스트 회고",
          diaryId: 1,
          createdAt: "invalid-date-format",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    });

    // When: 페이지 로드
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터 렌더링 대기
    await page.waitForFunction(
      () => {
        const elements = document.querySelectorAll(
          '[data-testid="retrospect-date"]'
        );
        return elements.length > 0;
      },
      { timeout: 500 }
    );

    // Then: 잘못된 날짜 형식이라도 원본 문자열 표시
    const retrospectDate = await page
      .locator('[data-testid="retrospect-date"]')
      .first()
      .textContent();

    expect(retrospectDate).toContain("invalid-date-format");
  });

  test("회고가 1개만 있을 때 (경계값) 올바르게 표시되어야 함", async ({
    page,
  }) => {
    // Given: 회고 1개만 존재
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: "단 하나의 회고",
          diaryId: 1,
          createdAt: "2024-01-15T10:00:00.000Z",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    });

    // When: 페이지 로드
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터 렌더링 대기
    await page.waitForFunction(
      () => {
        const elements = document.querySelectorAll(
          '[data-testid="retrospect-text"]'
        );
        return elements.length > 0;
      },
      { timeout: 500 }
    );

    // Then: 1개의 회고만 표시
    const retrospectTexts = await page
      .locator('[data-testid="retrospect-text"]')
      .allTextContents();

    expect(retrospectTexts).toHaveLength(1);
    expect(retrospectTexts[0]).toBe("단 하나의 회고");
  });

  test("같은 diaryId를 가진 회고가 많을 때 (100개) 모두 표시되어야 함", async ({
    page,
  }) => {
    // Given: 100개의 회고 생성
    await page.evaluate(() => {
      const retrospects = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        content: `회고 ${i + 1}`,
        diaryId: 1,
        createdAt: `2024-01-${String((i % 28) + 1).padStart(
          2,
          "0"
        )}T10:00:00.000Z`,
      }));
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    });

    // When: 페이지 로드
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터 렌더링 대기 (많은 데이터이므로 조금 더 대기)
    await page.waitForFunction(
      () => {
        const elements = document.querySelectorAll(
          '[data-testid="retrospect-text"]'
        );
        return elements.length > 0;
      },
      { timeout: 1000 }
    );

    // Then: 100개 모두 표시
    const retrospectTexts = await page
      .locator('[data-testid="retrospect-text"]')
      .allTextContents();

    expect(retrospectTexts).toHaveLength(100);
    expect(retrospectTexts[0]).toBe("회고 100"); // 최신순이므로 100이 첫 번째
    expect(retrospectTexts[99]).toBe("회고 1");
  });

  test("diaryId가 0일 때 (특수 경계값) 올바르게 필터링되어야 함", async ({
    page,
  }) => {
    // Given: diaryId가 0인 회고
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: "diaryId 0의 회고",
          diaryId: 0,
          createdAt: "2024-01-15T10:00:00.000Z",
        },
        {
          id: 2,
          content: "diaryId 1의 회고",
          diaryId: 1,
          createdAt: "2024-01-16T10:00:00.000Z",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    });

    // When: diaryId 0 페이지로 이동
    await page.goto("/diaries/0");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // Then: diaryId 0의 회고만 표시되어야 함 (현재 Hook은 0을 falsy로 처리할 수 있음)
    // 이 테스트는 Hook이 diaryId === 0을 올바르게 처리하는지 검증
    const retrospectTexts = await page
      .locator('[data-testid="retrospect-text"]')
      .all();

    // 현재 Hook 구현상 diaryId가 null이 아니면 처리하므로 0도 정상 처리되어야 함
    expect(retrospectTexts).toHaveLength(1);
  });

  test("음수 diaryId일 때 올바르게 필터링되어야 함", async ({ page }) => {
    // Given: 음수 diaryId를 가진 회고
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: "음수 diaryId 회고",
          diaryId: -1,
          createdAt: "2024-01-15T10:00:00.000Z",
        },
        {
          id: 2,
          content: "양수 diaryId 회고",
          diaryId: 1,
          createdAt: "2024-01-16T10:00:00.000Z",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    });

    // When: 음수 diaryId 페이지로 이동
    await page.goto("/diaries/-1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터 렌더링 대기
    await page.waitForFunction(
      () => {
        const elements = document.querySelectorAll(
          '[data-testid="retrospect-text"]'
        );
        return elements.length > 0;
      },
      { timeout: 500 }
    );

    // Then: 음수 diaryId도 기술적으로는 유효하므로 필터링되어 표시됨
    const retrospectTexts = await page
      .locator('[data-testid="retrospect-text"]')
      .allTextContents();

    expect(retrospectTexts).toHaveLength(1);
    expect(retrospectTexts[0]).toBe("음수 diaryId 회고");
  });

  test("특수문자가 포함된 회고 내용도 올바르게 표시되어야 함", async ({
    page,
  }) => {
    // Given: 특수문자가 포함된 회고
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: '<script>alert("XSS")</script> 특수문자 & < > " \' 테스트',
          diaryId: 1,
          createdAt: "2024-01-15T10:00:00.000Z",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    });

    // When: 페이지 로드
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터 렌더링 대기
    await page.waitForFunction(
      () => {
        const elements = document.querySelectorAll(
          '[data-testid="retrospect-text"]'
        );
        return elements.length > 0;
      },
      { timeout: 500 }
    );

    // Then: 특수문자가 이스케이프되어 표시되어야 함 (XSS 방지)
    const retrospectText = await page
      .locator('[data-testid="retrospect-text"]')
      .first()
      .textContent();

    // React는 자동으로 XSS를 방지하므로 텍스트로 표시됨
    expect(retrospectText).toContain("<script>");
    expect(retrospectText).toContain('alert("XSS")');
  });

  test("매우 긴 회고 내용도 올바르게 표시되어야 함", async ({ page }) => {
    // Given: 매우 긴 회고 (5000자)
    const longContent = "가".repeat(5000);
    await page.evaluate((content) => {
      const retrospects = [
        {
          id: 1,
          content: content,
          diaryId: 1,
          createdAt: "2024-01-15T10:00:00.000Z",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
    }, longContent);

    // When: 페이지 로드
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터 렌더링 대기
    await page.waitForFunction(
      () => {
        const elements = document.querySelectorAll(
          '[data-testid="retrospect-text"]'
        );
        return elements.length > 0;
      },
      { timeout: 500 }
    );

    // Then: 긴 내용도 정상 표시
    const retrospectText = await page
      .locator('[data-testid="retrospect-text"]')
      .first()
      .textContent();

    expect(retrospectText?.length).toBe(5000);
  });
});
