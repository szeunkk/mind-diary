import { test, expect } from "@playwright/test";

test.describe("Layout Auth Hook - 비로그인 유저", () => {
  test("비회원으로 /diaries 접속 시 로그인 버튼 노출 및 로그인 페이지 이동", async ({
    page,
  }) => {
    // localStorage 초기화 (비로그인 상태 보장)
    await page.goto("/diaries");
    await page.evaluate(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    });

    // /diaries 페이지 접속 및 로드 확인
    await page.goto("/diaries");
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();

    // 로그인 버튼 노출 확인
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveText("로그인");

    // 로그아웃 버튼 미노출 확인
    await expect(
      page.locator('[data-testid="logout-button"]')
    ).not.toBeVisible();

    // 유저 이름 미노출 확인
    await expect(page.locator('[data-testid="user-name"]')).not.toBeVisible();

    // 로그인 버튼 클릭하여 /auth/login 페이지로 이동
    await loginButton.click();
    await expect(page).toHaveURL("/auth/login");
  });
});

test.describe("Layout Auth Hook - 로그인 유저", () => {
  test("로그인 후 유저 이름과 로그아웃 버튼 노출 및 로그아웃 기능", async ({
    page,
  }) => {
    // 로그인 상태 설정 (회원으로 가장)
    await page.goto("/diaries");
    await page.evaluate(() => {
      window.__TEST_BYPASS__ = true;
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
    await page.reload();
    await page.waitForSelector('[data-testid="layout-header"]');

    // layout에서 유저 이름 노출 확인
    const userName = page.locator('[data-testid="user-name"]');
    await expect(userName).toBeVisible();

    // 로그아웃 버튼 노출 확인
    const logoutButton = page.locator('[data-testid="logout-button"]');
    await expect(logoutButton).toBeVisible();
    await expect(logoutButton).toHaveText("로그아웃");

    // 로그인 버튼 미노출 확인
    await expect(
      page.locator('[data-testid="login-button"]')
    ).not.toBeVisible();

    // 로그아웃 버튼 클릭하여 /auth/login 페이지로 이동
    await logoutButton.click();
    await expect(page).toHaveURL("/auth/login");
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();

    // /diaries 재접속하여 페이지 로드 확인
    await page.goto("/diaries");
    await expect(page.locator('[data-testid="layout-header"]')).toBeVisible();

    // layout에 로그인 버튼 노출 확인
    const loginButton = page.locator('[data-testid="login-button"]');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toHaveText("로그인");

    // 로그아웃 버튼 미노출 확인
    await expect(
      page.locator('[data-testid="logout-button"]')
    ).not.toBeVisible();

    // 유저 이름 미노출 확인
    await expect(page.locator('[data-testid="user-name"]')).not.toBeVisible();
  });
});
