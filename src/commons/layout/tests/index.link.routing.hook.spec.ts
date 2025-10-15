import { test, expect } from "@playwright/test";

test.describe("Layout Link Routing", () => {
  test.beforeEach(async ({ page }) => {
    // 일기 목록 페이지로 이동
    await page.goto("/diaries");
    // 레이아웃이 로드될 때까지 대기
    await page.waitForSelector('[data-testid="layout-header"]');
  });

  test("초기 로드 시 일기보관함 탭이 활성화되어 있어야 함", async ({
    page,
  }) => {
    // 일기보관함 탭이 활성화 상태인지 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesTab).toHaveClass(/tabActive/);

    // 일기보관함 텍스트가 활성화 상태인지 확인
    const diariesText = diariesTab.locator("p");
    await expect(diariesText).toHaveClass(/tabTextActive/);

    // 사진보관함 탭이 비활성화 상태인지 확인
    const picturesTab = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesTab).not.toHaveClass(/tabActive/);

    // 사진보관함 텍스트가 비활성화 상태인지 확인
    const picturesText = picturesTab.locator("p");
    await expect(picturesText).toHaveClass(/tabTextInactive/);
  });

  test("헤더 로고 클릭 시 일기 목록 페이지로 이동하고 일기보관함 탭이 활성화되어야 함", async ({
    page,
  }) => {
    // 다른 페이지로 이동 (사진보관함)
    await page.locator('[data-testid="nav-pictures"]').click();
    await page.waitForURL("/pictures");

    // 헤더 로고 클릭
    await page.locator('[data-testid="header-logo"]').click();
    await page.waitForURL("/diaries");

    // 일기보관함 탭이 활성화되었는지 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesTab).toHaveClass(/tabActive/);

    const diariesText = diariesTab.locator("p");
    await expect(diariesText).toHaveClass(/tabTextActive/);
  });

  test("일기보관함 탭 클릭 시 일기 목록 페이지로 이동하고 탭이 활성화되어야 함", async ({
    page,
  }) => {
    // 사진보관함으로 이동
    await page.locator('[data-testid="nav-pictures"]').click();
    await page.waitForURL("/pictures");

    // 일기보관함 탭 클릭
    await page.locator('[data-testid="nav-diaries"]').click();
    await page.waitForURL("/diaries");

    // 일기보관함 탭이 활성화되었는지 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesTab).toHaveClass(/tabActive/);

    const diariesText = diariesTab.locator("p");
    await expect(diariesText).toHaveClass(/tabTextActive/);

    // 사진보관함 탭이 비활성화되었는지 확인
    const picturesTab = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesTab).not.toHaveClass(/tabActive/);

    const picturesText = picturesTab.locator("p");
    await expect(picturesText).toHaveClass(/tabTextInactive/);
  });

  test("사진보관함 탭 클릭 시 사진 목록 페이지로 이동하고 탭이 활성화되어야 함", async ({
    page,
  }) => {
    // 사진보관함 탭 클릭
    await page.locator('[data-testid="nav-pictures"]').click();
    await page.waitForURL("/pictures");

    // 사진보관함 탭이 활성화되었는지 확인
    const picturesTab = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesTab).toHaveClass(/tabActive/);

    const picturesText = picturesTab.locator("p");
    await expect(picturesText).toHaveClass(/tabTextActive/);

    // 일기보관함 탭이 비활성화되었는지 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesTab).not.toHaveClass(/tabActive/);

    const diariesText = diariesTab.locator("p");
    await expect(diariesText).toHaveClass(/tabTextInactive/);
  });

  test("URL 직접 접근 시에도 올바른 탭이 활성화되어야 함", async ({ page }) => {
    // 사진보관함 페이지로 직접 이동
    await page.goto("/pictures");
    await page.waitForSelector('[data-testid="layout-header"]');

    // 사진보관함 탭이 활성화되었는지 확인
    const picturesTab = page.locator('[data-testid="nav-pictures"]');
    await expect(picturesTab).toHaveClass(/tabActive/);

    const picturesText = picturesTab.locator("p");
    await expect(picturesText).toHaveClass(/tabTextActive/);

    // 일기보관함 탭이 비활성화되었는지 확인
    const diariesTab = page.locator('[data-testid="nav-diaries"]');
    await expect(diariesTab).not.toHaveClass(/tabActive/);

    const diariesText = diariesTab.locator("p");
    await expect(diariesText).toHaveClass(/tabTextInactive/);
  });
});
