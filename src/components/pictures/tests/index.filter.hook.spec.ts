import { test, expect } from "@playwright/test";
import { PICTURES } from "@/commons/constants/url";

test.describe("Pictures Filter 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // /pictures 페이지로 이동
    await page.goto(PICTURES);
    // 페이지 로드 완료 대기 (고정식별자 data-testid 사용)
    await page.waitForSelector('[data-testid="pictures-container"]', {
      timeout: 2000,
    });
  });

  test("페이지 로드 시 기본 필터가 선택되어 있고, 이미지가 640x640 사이즈로 표시된다", async ({
    page,
  }) => {
    // 필터 영역이 로드되었는지 확인
    const filterArea = page.locator('[data-testid="filter-area"]');
    await expect(filterArea).toBeVisible();

    // 첫 번째 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="picture-image"]', {
      timeout: 2000,
    });

    // 첫 번째 이미지의 계산된 스타일(실제 렌더링된 크기) 확인
    const firstImage = page.locator('[data-testid="picture-image"]').first();
    const boundingBox = await firstImage.boundingBox();

    expect(boundingBox).toBeTruthy();
    expect(Math.round(boundingBox!.width)).toBe(640);
    expect(Math.round(boundingBox!.height)).toBe(640);
  });

  test('필터를 "가로형"으로 변경하면 이미지가 640x480 사이즈로 표시된다', async ({
    page,
  }) => {
    // 첫 번째 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="picture-image"]', {
      timeout: 2000,
    });

    // SelectBox 클릭하여 열기
    const selectBox = page.locator('[data-testid="selectbox-trigger"]');
    await selectBox.click();

    // "가로형" 옵션 선택
    const horizontalOption = page.getByText("가로형");
    await horizontalOption.click();

    // 이미지 크기가 변경될 때까지 잠시 대기
    await page.waitForTimeout(200);

    // 첫 번째 이미지의 계산된 스타일(실제 렌더링된 크기) 확인
    const firstImage = page.locator('[data-testid="picture-image"]').first();
    const boundingBox = await firstImage.boundingBox();

    expect(boundingBox).toBeTruthy();
    expect(Math.round(boundingBox!.width)).toBe(640);
    expect(Math.round(boundingBox!.height)).toBe(480);
  });

  test('필터를 "세로형"으로 변경하면 이미지가 480x640 사이즈로 표시된다', async ({
    page,
  }) => {
    // 첫 번째 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="picture-image"]', {
      timeout: 2000,
    });

    // SelectBox 클릭하여 열기
    const selectBox = page.locator('[data-testid="selectbox-trigger"]');
    await selectBox.click();

    // "세로형" 옵션 선택
    const verticalOption = page.getByText("세로형");
    await verticalOption.click();

    // 이미지 크기가 변경될 때까지 잠시 대기
    await page.waitForTimeout(200);

    // 첫 번째 이미지의 계산된 스타일(실제 렌더링된 크기) 확인
    const firstImage = page.locator('[data-testid="picture-image"]').first();
    const boundingBox = await firstImage.boundingBox();

    expect(boundingBox).toBeTruthy();
    expect(Math.round(boundingBox!.width)).toBe(480);
    expect(Math.round(boundingBox!.height)).toBe(640);
  });

  test('필터를 "가로형"으로 변경 후 다시 "기본"으로 변경하면 이미지가 640x640 사이즈로 표시된다', async ({
    page,
  }) => {
    // 첫 번째 이미지가 로드될 때까지 대기
    await page.waitForSelector('[data-testid="picture-image"]', {
      timeout: 2000,
    });

    // SelectBox 클릭하여 "가로형" 선택
    const selectBox = page.locator('[data-testid="selectbox-trigger"]');
    await selectBox.click();
    const horizontalOption = page.getByText("가로형");
    await horizontalOption.click();
    await page.waitForTimeout(200);

    // 다시 SelectBox 클릭하여 "기본" 선택
    await selectBox.click();
    const defaultOption = page.getByText("기본");
    await defaultOption.click();
    await page.waitForTimeout(200);

    // 첫 번째 이미지의 계산된 스타일(실제 렌더링된 크기) 확인
    const firstImage = page.locator('[data-testid="picture-image"]').first();
    const boundingBox = await firstImage.boundingBox();

    expect(boundingBox).toBeTruthy();
    expect(Math.round(boundingBox!.width)).toBe(640);
    expect(Math.round(boundingBox!.height)).toBe(640);
  });
});
