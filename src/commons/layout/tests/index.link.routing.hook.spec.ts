import { test, expect } from '@playwright/test';

test.describe('Layout Link Routing', () => {
  test.beforeEach(async ({ page }) => {
    // 일기목록 페이지로 이동하여 레이아웃이 있는 페이지에서 테스트
    await page.goto('/diaries');
    // 페이지 로드 완료 대기 (data-testid로 식별)
    await page.waitForSelector('[data-testid="layout-header"]');
  });

  test('헤더 로고 클릭시 일기목록 페이지로 이동', async ({ page }) => {
    // 헤더 로고 클릭
    await page.click('[data-testid="header-logo"]');
    
    // URL이 /diaries로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="layout-header"]');
  });

  test('네비게이션 일기보관함 클릭시 일기목록 페이지로 이동', async ({ page }) => {
    // 네비게이션 일기보관함 탭 클릭
    await page.click('[data-testid="nav-diaries"]');
    
    // URL이 /diaries로 변경되었는지 확인
    await expect(page).toHaveURL('/diaries');
    
    // 페이지 로드 완료 대기
    await page.waitForSelector('[data-testid="layout-header"]');
  });

  test('네비게이션 사진보관함 클릭시 사진목록 페이지로 이동', async ({ page }) => {
    // 네비게이션 사진보관함 탭 클릭
    await page.click('[data-testid="nav-pictures"]');
    
    // URL이 /pictures로 변경되었는지 확인
    await expect(page).toHaveURL('/pictures');
  });

  test('클릭 가능한 요소들이 cursor: pointer 스타일을 가지고 있는지 확인', async ({ page }) => {
    // 헤더 로고의 cursor 스타일 확인
    const headerLogo = page.locator('[data-testid="header-logo"]');
    await expect(headerLogo).toHaveCSS('cursor', 'pointer');
    
    // 네비게이션 탭들의 cursor 스타일 확인
    const navDiaries = page.locator('[data-testid="nav-diaries"]');
    await expect(navDiaries).toHaveCSS('cursor', 'pointer');
    
    const navPictures = page.locator('[data-testid="nav-pictures"]');
    await expect(navPictures).toHaveCSS('cursor', 'pointer');
  });
});
