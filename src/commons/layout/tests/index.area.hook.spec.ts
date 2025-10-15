import { test, expect } from "@playwright/test";

test.describe("Layout Area 노출 여부 테스트", () => {
  // /diaries 페이지: 모든 영역 노출
  test("/diaries 페이지에서 모든 영역이 노출되어야 함", async ({ page }) => {
    await page.goto("/diaries");

    // 페이지 로드 대기 (data-testid로 식별)
    await page.waitForSelector('[data-testid="layout-header"]');

    // header 영역 전체 노출 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();

    // header 영역 내 로고 노출 확인
    const logo = page.locator('[data-testid="header-logo"]');
    await expect(logo).toBeVisible();

    // banner 영역 전체 노출 확인
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeVisible();

    // navigation 영역 전체 노출 확인
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).toBeVisible();

    // footer 영역 전체 노출 확인
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  // /pictures 페이지: 모든 영역 노출 (테스트 skip 대상이지만 구조 확인용)
  test.skip("/pictures 페이지에서 모든 영역이 노출되어야 함", async ({
    page,
  }) => {
    await page.goto("/pictures");

    await page.waitForSelector('[data-testid="layout-header"]');

    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();

    const logo = page.locator('[data-testid="header-logo"]');
    await expect(logo).toBeVisible();

    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeVisible();

    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).toBeVisible();

    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  // /auth/login 페이지: 모든 영역 미노출 (테스트 skip)
  test.skip("/auth/login 페이지에서 모든 영역이 미노출되어야 함", async ({
    page,
  }) => {
    await page.goto("/auth/login");

    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).not.toBeVisible();

    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).not.toBeVisible();

    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).not.toBeVisible();

    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).not.toBeVisible();
  });

  // /auth/signup 페이지: 모든 영역 미노출 (테스트 skip)
  test.skip("/auth/signup 페이지에서 모든 영역이 미노출되어야 함", async ({
    page,
  }) => {
    await page.goto("/auth/signup");

    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).not.toBeVisible();

    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).not.toBeVisible();

    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).not.toBeVisible();

    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).not.toBeVisible();
  });

  // /diaries/[id] 페이지: header와 footer만 노출, banner와 navigation 미노출
  test("/diaries/1 페이지에서 header와 footer만 노출되어야 함", async ({
    page,
  }) => {
    await page.goto("/diaries/1");

    await page.waitForSelector('[data-testid="layout-header"]');

    // header 영역 전체 노출 확인
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();

    // header 영역 내 로고 노출 확인
    const logo = page.locator('[data-testid="header-logo"]');
    await expect(logo).toBeVisible();

    // banner 영역 미노출 확인
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).not.toBeVisible();

    // navigation 영역 미노출 확인
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).not.toBeVisible();

    // footer 영역 전체 노출 확인
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });
});
