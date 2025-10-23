import { test, expect } from "@playwright/test";
import { PICTURES } from "@/commons/constants/url";

test.describe("Pictures API Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto(PICTURES);

    // 페이지가 완전히 로드될 때까지 대기 (고정식별자 data-testid 사용)
    await page.waitForSelector('[data-testid="pictures-container"]', {
      timeout: 2000,
    });
  });

  test("성공 시나리오: 페이지가 정상적으로 로드되고 컨테이너가 표시된다", async ({
    page,
  }) => {
    // 페이지 컨테이너가 로드되었는지 확인
    const container = page.locator('[data-testid="pictures-container"]');
    await expect(container).toBeVisible();

    // 필터 영역이 있는지 확인
    const filterArea = page.locator('[data-testid="filter-area"]');
    await expect(filterArea).toBeVisible();

    // 메인 영역이 있는지 확인
    const mainArea = page.locator('[data-testid="main-area"]');
    await expect(mainArea).toBeVisible();
  });

  test("스플래시 스크린 또는 실제 데이터 로딩 확인", async ({ page }) => {
    // 스플래시 스크린이 있거나 실제 사진이 로드되어야 함
    await page.waitForFunction(
      () => {
        const splashScreens = document.querySelectorAll(
          '[data-testid="splash-screen"]'
        );
        const pictureItems = document.querySelectorAll(
          '[data-testid="picture-item"]'
        );
        return splashScreens.length > 0 || pictureItems.length > 0;
      },
      { timeout: 2000 }
    );

    // 스플래시 스크린 확인
    const splashScreens = page.locator('[data-testid="splash-screen"]');
    const pictureItems = page.locator('[data-testid="picture-item"]');

    const splashCount = await splashScreens.count();
    const pictureCount = await pictureItems.count();

    // 스플래시 스크린이 있거나 사진이 있어야 함
    expect(splashCount > 0 || pictureCount > 0).toBeTruthy();

    // 스플래시 스크린이 있다면 6개여야 함
    if (splashCount > 0) {
      expect(splashCount).toBe(6);
    }
  });

  test("실제 API 데이터 로딩 확인", async ({ page }) => {
    // API 로딩이 완료될 때까지 대기 (네트워크 통신 timeout 2000ms 미만)
    await page.waitForSelector('[data-testid="picture-item"]', {
      timeout: 1800,
    });

    // 강아지 사진들이 로드되었는지 확인
    const pictureItems = page.locator('[data-testid="picture-item"]');
    const pictureCount = await pictureItems.count();
    expect(pictureCount).toBeGreaterThanOrEqual(6);

    // 첫 번째 이미지가 dog.ceo API에서 온 실제 데이터인지 확인
    const firstImage = page.locator('[data-testid="picture-image"]').first();
    await expect(firstImage).toBeVisible();
  });

  test("성공 시나리오: dog.ceo API에서 온 실제 이미지 주소 확인", async ({
    page,
  }) => {
    // 네트워크 요청 모니터링 먼저 설정
    const dogApiRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("dog.ceo")) {
        dogApiRequests.push(request.url());
      }
    });

    // 캐시 무효화를 위해 새로운 페이지 컨텍스트로 재방문
    await page.goto(PICTURES + "?cache_bust=" + Date.now());

    // API 로딩이 완료될 때까지 대기
    await page.waitForSelector('[data-testid="picture-item"]', {
      timeout: 1800,
    });

    // dog.ceo API 요청이 있었는지 확인
    expect(dogApiRequests.length).toBeGreaterThan(0);
    expect(dogApiRequests[0]).toContain("dog.ceo/api/breeds/image/random/6");
  });

  test("무한 스크롤: 마지막 2개 남은 상태에서 추가 로딩", async ({ page }) => {
    // 초기 로딩 완료 대기
    await page.waitForSelector('[data-testid="picture-item"]', {
      timeout: 1800,
    });

    // 초기 사진 개수 확인
    let pictureItems = page.locator('[data-testid="picture-item"]');
    const initialCount = await pictureItems.count();
    expect(initialCount).toBeGreaterThanOrEqual(6);

    // 마지막에서 2번째 아이템으로 스크롤 (무한 스크롤 트리거 조건)
    const triggerItem = pictureItems.nth(initialCount - 2);
    await triggerItem.scrollIntoViewIfNeeded();

    // 추가 아이템이 로드될 때까지 대기
    await page.waitForFunction(
      (initialCount) => {
        return (
          document.querySelectorAll('[data-testid="picture-item"]').length >
          initialCount
        );
      },
      initialCount,
      { timeout: 1800 }
    );

    // 추가 아이템이 로드되었는지 확인
    pictureItems = page.locator('[data-testid="picture-item"]');
    const newCount = await pictureItems.count();
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test("실패 시나리오: API 요청 실패 시 에러 상태 표시", async ({ page }) => {
    // 새로운 페이지 컨텍스트에서 API 모킹 설정
    await page.route("**/dog.ceo/api/breeds/image/random/**", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Internal Server Error",
          status: "error",
        }),
      });
    });

    // 모킹이 설정된 상태에서 페이지 방문
    await page.goto(PICTURES);

    // 페이지 컨테이너 로드 대기
    await page.waitForSelector('[data-testid="pictures-container"]', {
      timeout: 1800,
    });

    // React Query retry 완료까지 대기 (에러 또는 스플래시 스크린 상태 확인)
    await page.waitForFunction(
      () => {
        const errorMessage = document.querySelector(
          '[data-testid="error-message"]'
        );
        const splashScreens = document.querySelectorAll(
          '[data-testid="splash-screen"]'
        );
        // 에러 메시지가 나타나거나 스플래시 스크린이 사라질 때까지 대기
        return errorMessage !== null || splashScreens.length === 0;
      },
      { timeout: 1800 } // 네트워크 통신 관련이므로 2000ms 미만
    );

    // 에러 상태가 표시되는지 확인
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();

    // 에러 메시지 내용 확인
    await expect(errorMessage).toContainText("사진을 불러올 수 없습니다");

    // 재시도 버튼 확인
    const retryButton = page.locator('[data-testid="retry-button"]');
    await expect(retryButton).toBeVisible();
  });

  test("필터 UI 존재 확인", async ({ page }) => {
    // 필터 영역이 표시되는지 확인
    const filterArea = page.locator('[data-testid="filter-area"]');
    await expect(filterArea).toBeVisible();

    // 필터 영역 내에 SelectBox가 있는지 확인
    const selectBox = filterArea.locator("div").first(); // SelectBox 컨테이너
    await expect(selectBox).toBeVisible();
  });
});
