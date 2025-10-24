import { test, expect } from "@playwright/test";

/**
 * 회고 폼 등록 기능 테스트
 *
 * 테스트 데이터 타입:
 * - 저장소: localStorage
 * - key: retrospects
 * - value: [{ id: number, content: string, diaryId: number, createdAt: string }]
 *
 * 시나리오:
 * 1. 일기 상세 페이지 접속
 * 2. 회고 입력 시 입력 버튼 활성화 확인
 * 3. 회고 등록 시 localStorage에 저장 확인
 * 4. 페이지 새로고침 후 회고 목록 확인
 */

/**
 * 회고 데이터 타입 정의
 */
interface RetrospectData {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

test.describe("회고 폼 등록 기능", () => {
  // 테스트 전 준비: 로그인 및 실제 데이터 생성
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
  });

  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      const diaries = [
        {
          id: 1,
          title: "테스트 일기 1",
          content: "테스트 내용 1입니다.",
          emotion: "HAPPY",
          createdAt: "2024-01-01T00:00:00.000Z",
        },
        {
          id: 2,
          title: "테스트 일기 2",
          content: "테스트 내용 2입니다.",
          emotion: "SAD",
          createdAt: "2024-01-02T00:00:00.000Z",
        },
      ];
      localStorage.setItem("diaries", JSON.stringify(diaries));
    });
  });

  test.beforeEach(async ({ page }) => {
    // 실제 일기 데이터가 설정된 상태로 페이지 로드
    await page.goto("/diaries/1");

    // 기존 회고 데이터 삭제 (테스트 격리) – 최초 한 번만 실행
    await page.evaluate(() => localStorage.removeItem("retrospects"));

    // 페이지 로드 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 실제로 렌더링될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 5000 }
    );
  });

  test("회고 입력 시 입력 버튼이 활성화되어야 함", async ({ page }) => {
    // 회고 입력 필드 찾기
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    const submitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );

    // 초기 상태: 버튼 비활성화
    await expect(submitButton).toBeDisabled();

    // 회고 입력
    await retrospectInput.fill("첫 번째 회고입니다.");

    // 버튼 활성화 확인
    await expect(submitButton).toBeEnabled();

    // 입력 내용 삭제
    await retrospectInput.fill("");

    // 버튼 다시 비활성화
    await expect(submitButton).toBeDisabled();
  });

  test("회고 등록 시 localStorage에 새로운 배열로 저장되어야 함 (기존 데이터 없음)", async ({
    page,
  }) => {
    // Console 메시지 모니터링 (디버깅용)
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

    // 회고 입력 및 제출
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    const submitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );

    await retrospectInput.fill("새로운 회고입니다.");

    // 페이지 리로드를 기다리기 위해 Promise.all 사용
    await Promise.all([
      page.waitForEvent("load"), // 페이지 로드 이벤트 대기
      submitButton.click(),
    ]);

    // 페이지 로드 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 실제로 렌더링될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 5000 }
    );

    // localStorage 확인
    const retrospects = await page.evaluate(() => {
      const data = localStorage.getItem("retrospects");
      return data ? JSON.parse(data) : null;
    });

    // 검증
    expect(retrospects).not.toBeNull();
    expect(Array.isArray(retrospects)).toBe(true);
    expect(retrospects.length).toBe(1);
    expect(retrospects[0].id).toBe(1);
    expect(retrospects[0].content).toBe("새로운 회고입니다.");
    expect(retrospects[0].diaryId).toBe(1);
    expect(retrospects[0].createdAt).toBeTruthy();
  });

  test("회고 등록 시 기존 배열에 추가되어야 함 (기존 데이터 있음)", async ({
    page,
  }) => {
    // 기존 회고 데이터 생성
    await page.evaluate(() => {
      const existingRetrospects = [
        {
          id: 1,
          content: "기존 회고 1",
          diaryId: 1,
          createdAt: "2024-01-01T00:00:00.000Z",
        },
        {
          id: 2,
          content: "기존 회고 2",
          diaryId: 1,
          createdAt: "2024-01-02T00:00:00.000Z",
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(existingRetrospects));
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 실제로 렌더링될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 5000 }
    );

    // 새로운 회고 입력 및 제출
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    const submitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );

    await retrospectInput.fill("새로운 회고입니다.");

    // 페이지 리로드를 기다리기 위해 Promise.all 사용
    await Promise.all([
      page.waitForEvent("load"), // 페이지 로드 이벤트 대기
      submitButton.click(),
    ]);

    // 페이지 로드 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 실제로 렌더링될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 5000 }
    );

    // localStorage 확인
    const retrospects = await page.evaluate(() => {
      const data = localStorage.getItem("retrospects");
      return data ? JSON.parse(data) : null;
    });

    // 검증: 기존 2개 + 새로운 1개 = 3개
    expect(retrospects).not.toBeNull();
    expect(Array.isArray(retrospects)).toBe(true);
    expect(retrospects.length).toBe(3);

    // 새로운 회고의 id는 가장 큰 id + 1 = 3
    const newRetrospect = retrospects.find((r: RetrospectData) => r.id === 3);
    expect(newRetrospect).toBeTruthy();
    expect(newRetrospect.content).toBe("새로운 회고입니다.");
    expect(newRetrospect.diaryId).toBe(1);
    expect(newRetrospect.createdAt).toBeTruthy();
  });

  test("회고 등록 후 입력 필드가 초기화되어야 함", async ({ page }) => {
    // 회고 입력 및 제출
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    const submitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );

    await retrospectInput.fill("테스트 회고입니다.");

    // 페이지 리로드를 기다리기 위해 Promise.all 사용
    await Promise.all([
      page.waitForEvent("load"), // 페이지 로드 이벤트 대기
      submitButton.click(),
    ]);

    // 페이지 로드 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 실제로 렌더링될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 5000 }
    );

    // 입력 필드 초기화 확인
    const inputValue = await retrospectInput.inputValue();
    expect(inputValue).toBe("");

    // 버튼 비활성화 확인
    await expect(submitButton).toBeDisabled();
  });

  test("여러 일기의 회고가 각각의 diaryId로 저장되어야 함", async ({
    page,
  }) => {
    // 일기 1에 회고 등록
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    const retrospectInput1 = page.locator('[data-testid="retrospect-input"]');
    const submitButton1 = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );

    await retrospectInput1.fill("일기 1의 회고입니다.");

    // 페이지 리로드를 기다리기 위해 Promise.all 사용
    await Promise.all([
      page.waitForEvent("load"), // 새로고침 완료 대기
      submitButton1.click(),
    ]);
    // 페이지 로드 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-container"]');
    await page.waitForFunction(
      () =>
        document.querySelectorAll('[data-testid="retrospect-text"]').length >= 1
    );

    await page.goto("/diaries/2");
    await page.waitForSelector('[data-testid="diary-detail-container"]');

    // 데이터가 실제로 렌더링될 때까지 대기
    await page.waitForFunction(
      () => {
        const titleEl = document.querySelector('[data-testid="diary-title"]');
        return (
          titleEl && titleEl.textContent && titleEl.textContent.trim() !== ""
        );
      },
      { timeout: 10000 }
    );

    const retrospectInput2 = page.locator('[data-testid="retrospect-input"]');
    const submitButton2 = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );

    await retrospectInput2.fill("일기 2의 회고입니다.");

    // 페이지 리로드를 기다리기 위해 Promise.all 사용
    await Promise.all([
      page.waitForEvent("load"), // 새로고침 완료 대기
      submitButton2.click(),
    ]);
    // 페이지 로드 대기 (data-testid 기반)
    await page.waitForSelector('[data-testid="diary-detail-container"]');
    await page.waitForFunction(
      () =>
        document.querySelectorAll('[data-testid="retrospect-text"]').length >= 1
    );

    // localStorage 확인
    const retrospects = await page.evaluate(() => {
      const data = localStorage.getItem("retrospects");
      return data ? JSON.parse(data) : null;
    });

    // 검증
    expect(retrospects.length).toBe(2);

    const retrospect1 = retrospects.find((r: RetrospectData) => r.diaryId === 1);
    const retrospect2 = retrospects.find((r: RetrospectData) => r.diaryId === 2);

    expect(retrospect1).toBeTruthy();
    expect(retrospect1.content).toBe("일기 1의 회고입니다.");

    expect(retrospect2).toBeTruthy();
    expect(retrospect2.content).toBe("일기 2의 회고입니다.");
  });
});
